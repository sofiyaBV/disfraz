import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { User } from '../auth/decorators/user.decorator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { commentPaginateConfig } from '../config/pagination.config';
import { RequestUser } from '../common/interfaces/request.interface';

@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Створити новий коментар до продукту' })
  @ApiResponse({
    status: 201,
    description: 'Коментар успішно створений',
    type: Comment,
  })
  @ApiBody({ type: CreateCommentDto })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: RequestUser,
  ) {
    return this.commentsService.create(createCommentDto, user.id);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати всі коментарі' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх коментарів',
  })
  @PaginatedSwaggerDocs(CreateCommentDto, commentPaginateConfig)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Comment>> {
    return this.commentsService.findAllPag(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати коментар за ID' })
  @ApiResponse({
    status: 200,
    description: 'Коментар знайдений',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Коментар не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID коментаря',
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Оновити коментар за ID' })
  @ApiResponse({
    status: 200,
    description: 'Коментар успішно оновлений',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Коментар не знайдений' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID коментаря',
    example: 1,
  })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Видалити коментар за ID' })
  @ApiResponse({ status: 200, description: 'Коментар успішно видалений' })
  @ApiResponse({ status: 404, description: 'Коментар не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID коментаря',
    example: 1,
  })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
