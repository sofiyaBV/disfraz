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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, type: SignInResponseDto, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Ошибка авторизации' })
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ Теперь проверка и по JWT, и по ролям
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  @ApiResponse({ status: 401, description: 'Неавторизованный запрос' })
  getProfile(@Request() req) {
    return req.user;
  }
}
