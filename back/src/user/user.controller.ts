import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto'; // ✅ Импорт DTO

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  @ApiBody({ type: CreateUserDto }) // ✅ Используем DTO в Swagger
  @Post()
  create(@Body() createUserDto: CreateUserDto) { // ✅ Заменяем Partial<User> на CreateUserDto
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
}
