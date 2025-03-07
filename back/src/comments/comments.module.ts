import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, ProductAttribute])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
