import {
  Body,
  Controller,
  Delete, // Добавляем Delete
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@ApiTags('User')
@Controller('user')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  @ApiBody({ type: CreateAdminDto })
  @Post()
  // @Roles(Role.Admin)
  create(@Body() createAdminDto: CreateAdminDto): Promise<User> {
    return this.userService.createAdmin(createAdminDto);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', example: 1 })
  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: 'Пользователь успешно удален' };
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
        total: {
          type: 'number',
          description: 'Общее количество пользователей',
        },
        page: { type: 'number', description: 'Текущая страница' },
        limit: {
          type: 'number',
          description: 'Количество записей на страницу',
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Количество записей на страницу',
  })
  @Get()
  @Roles(Role.Admin)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse<User>> {
    const { data, total } = await this.userService.findAllPag(page, limit);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', example: 1 })
  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }
}
