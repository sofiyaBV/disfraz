import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'; // Добавлены импорты Get и UseGuards
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'; // Импортируем JwtAuthGuard

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body('username') username: string, @Body('password') password: string) {
    return this.authService.signIn(username, password);
  }

  @UseGuards(JwtAuthGuard) // Защищаем маршрут с помощью JwtAuthGuard
  @Get('protected') // Новый маршрут для доступа к защищённым данным
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
