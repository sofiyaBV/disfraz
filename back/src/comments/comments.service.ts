import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { User } from '../user/entities/user.entity';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { commentPaginateConfig } from '../config/pagination.config';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(ProductAttribute)
    private readonly productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const { productAttributeId, content } = createCommentDto;

    const productAttribute =
      await this.productAttributeRepository.findOneOrFail({
        where: { id: productAttributeId },
      });

    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const comment = this.commentRepository.create({
      content,
      productAttribute,
      user,
      isModerated: false,
    });

    return await this.commentRepository.save(comment);
  }

  async findAllPag(query: PaginateQuery): Promise<Paginated<Comment>> {
    return paginate<Comment>(
      query,
      this.commentRepository,
      commentPaginateConfig,
    );
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ['productAttribute', 'user'],
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['productAttribute', 'user'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepository.delete(id);
  }
}
