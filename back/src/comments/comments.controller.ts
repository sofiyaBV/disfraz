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

@ApiTags('Comments')
@Controller('comments')
@ApiBearerAuth() // Вказує, що потрібен JWT-токен для доступу
@UseGuards(AuthGuard('jwt'), RolesGuard) // Захист через JWT і ролі
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully created',
    type: Comment,
  })
  @ApiBody({ type: CreateCommentDto })
  @Post()
  @Roles(Role.User, Role.Admin) // Доступ для авторизованих користувачів і адмінів
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'List of all comments',
    type: [Comment],
  })
  @Get()
  @Roles(Role.Admin) // Тільки адмін може бачити всі коментарі
  findAll() {
    return this.commentsService.findAll();
  }

  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment found', type: Comment })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Comment ID',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin) // Доступ для авторизованих користувачів і адмінів
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Comment ID',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin) // Тільки адмін може оновлювати коментар (модерація)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Comment ID',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin) // Тільки адмін може видаляти коментар
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
