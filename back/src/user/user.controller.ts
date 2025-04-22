import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
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
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { userPaginateConfig } from '../config/pagination.config';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Додати нового користувача' })
  @ApiResponse({
    status: 201,
    description: 'користувача',
    type: User,
  })
  @ApiBody({ type: CreateAdminDto })
  @Post()
  @Roles(Role.Admin)
  create(@Body() createAdminDto: CreateAdminDto): Promise<User> {
    return this.userService.createAdmin(createAdminDto);
  }

  @ApiOperation({ summary: 'Оновити користувача за ID' })
  @ApiResponse({
    status: 200,
    description: 'Користувача успiшно оновлено',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Користувач не знайдений' })
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

  @ApiOperation({ summary: 'Видалити користувача за ID' })
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
    return { message: 'Користувача успішно видалено' };
  }

  @ApiOperation({ summary: 'Отримати всіх користувачів' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
  })
  @PaginatedSwaggerDocs(UserDto, userPaginateConfig)
  @Get()
  @Roles(Role.Admin)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAllPag(query);
  }

  @ApiOperation({ summary: 'Отримати користувача за ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', example: 1 })
  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }
}
