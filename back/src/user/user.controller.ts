import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard) // ✅ Сначала AuthGuard, потом RolesGuard
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created', type: User })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @Roles(Role.Admin) // ✅ Только админ может создавать пользователей
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  @Get()
  @Roles(Role.User, Role.Admin) 
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', example: 1 })
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
}
