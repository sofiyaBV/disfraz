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
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { User } from '../auth/decorators/user.decorator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { commentPaginateConfig } from '../config/pagination.config';

@ApiTags('Comments')
@Controller('comments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Создать новый комментарий к продукту' })
  @ApiResponse({
    status: 201,
    description: 'Комментарий успешно создан',
    type: Comment,
  })
  @ApiBody({ type: CreateCommentDto })
  @Post()
  @Roles(Role.User, Role.Admin)
  async create(@Body() createCommentDto: CreateCommentDto, @User() user: any) {
    return this.commentsService.create(createCommentDto, user.id);
  }

  @ApiOperation({ summary: 'Получить все комментарии' })
  @ApiResponse({
    status: 200,
    description: 'Список всех комментариев',
  })
  @PaginatedSwaggerDocs(CreateCommentDto, commentPaginateConfig)
  @Get()
  @Roles(Role.Admin)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Comment>> {
    return this.commentsService.findAllPag(query);
  }

  @ApiOperation({ summary: 'Получить комментарий по ID' })
  @ApiResponse({
    status: 200,
    description: 'Комментарий найден',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID комментария',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить комментарий по ID' })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно обновлен',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID комментария',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @ApiOperation({ summary: 'Удалить комментарий по ID' })
  @ApiResponse({ status: 200, description: 'Комментарий успешно удален' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID комментария',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
