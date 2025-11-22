import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { userPaginateConfig } from '../config/pagination.config';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Додати нового користувача' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Користувача успішно створено',
    type: User,
  })
  create(@Body() createAdminDto: CreateAdminDto): Promise<User> {
    return this.userService.createAdmin(createAdminDto);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Отримати всіх користувачів' })
  @ApiResponse({
    status: 200,
    description: 'Список всіх користувачів',
  })
  @PaginatedSwaggerDocs(UserDto, userPaginateConfig)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAllPag(query);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID користувача',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Користувача знайдено', type: User })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Оновити користувача за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID користувача',
    example: 1,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Користувача успішно оновлено',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Видалити користувача за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID користувача',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Користувача успішно видалено' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: 'Користувача успішно видалено' };
  }
}
