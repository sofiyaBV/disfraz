import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    type: SignInResponseDto,
    description: 'Успешный вход',
  })
  @ApiResponse({ status: 401, description: 'Ошибка авторизации' })
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(
      signInDto.email,
      signInDto.phone,
      signInDto.password,
    );
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.register(createUserDto);
    return { message: 'Пользователь успешно зарегистрирован' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  @ApiResponse({ status: 401, description: 'Неавторизованный запрос' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Авторизация через Google' })
  @ApiResponse({ status: 302, description: 'Перенаправлення на Google' })
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback для Google авторизації' })
  @ApiResponse({
    status: 200,
    description: 'Успішна авторизація через Google',
  })
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    const user = req.user;
    if (!user || !user.access_token) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    return res.json({
      access_token: user.access_token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    });
  }
}
