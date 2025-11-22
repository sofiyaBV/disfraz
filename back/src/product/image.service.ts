import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import * as sharp from 'sharp';

export interface ImageUploadResult {
  url: string;
  deleteHash: string;
}

interface ImgBBResponse {
  success: boolean;
  data: {
    url: string;
    delete_url: string;
  };
  status: number;
}

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  private readonly imgbbApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.imgbbApiKey = this.configService.get<string>('IMGBB_API_KEY');
    if (!this.imgbbApiKey) {
      throw new Error('IMGBB_API_KEY не визначено у змінних оточення');
    }
  }

  async upload(file: Express.Multer.File): Promise<ImageUploadResult> {
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 1200 })
      .jpeg({ quality: 80 })
      .toBuffer();

    const formData = new FormData();
    formData.append('image', compressedBuffer.toString('base64'));

    try {
      const response = await axios.post<ImgBBResponse>(
        'https://api.imgbb.com/1/upload',
        formData,
        {
          params: { key: this.imgbbApiKey },
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (response.data.success) {
        this.logger.log(`Image uploaded: ${response.data.data.url}`);
        return {
          url: response.data.data.url,
          deleteHash: response.data.data.delete_url.split('/').pop(),
        };
      }

      throw new InternalServerErrorException(
        'Не вдалося завантажити зображення',
      );
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response
        ? `Помилка ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : error.message || 'Невідома помилка';

      this.logger.error(`Image upload failed: ${errorMessage}`);
      throw new InternalServerErrorException(
        `Помилка завантаження: ${errorMessage}`,
      );
    }
  }

  async uploadMany(files: Express.Multer.File[]): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];

    for (const file of files) {
      const result = await this.upload(file);
      results.push(result);
    }

    return results;
  }

  async delete(deleteHash: string): Promise<void> {
    try {
      await axios.get(`https://api.imgbb.com/1/delete/${deleteHash}`);
      this.logger.log(`Image deleted: ${deleteHash}`);
    } catch (err) {
      const error = err as AxiosError;
      this.logger.warn(
        `Failed to delete image ${deleteHash}: ${error.message}`,
      );
    }
  }

  async deleteMany(images: { deleteHash: string }[]): Promise<void> {
    for (const image of images) {
      await this.delete(image.deleteHash);
    }
  }
}
