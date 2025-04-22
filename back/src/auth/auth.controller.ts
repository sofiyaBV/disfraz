import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
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

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Авторизація користувача' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    type: SignInResponseDto,
    description: 'Успішний вхід',
  })
  @ApiResponse({ status: 401, description: 'Помилка авторизації' })
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Користувач успішно зареєстрований',
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані' })
  async register(
    @Body() CreateUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.register(CreateUserDto);
    return { message: 'Користувач успішно зареєстрований' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримання профілю користувача' })
  @ApiResponse({ status: 200, description: 'Інформація про користувача' })
  @ApiResponse({ status: 401, description: 'Неавторизований запит' })
  getProfile(@Request() req) {
    return req.user;
  }
}
