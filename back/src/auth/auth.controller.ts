import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // 👈 Делаем вход публичным
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    console.log('Sign-in attempt:', { username });
    return this.authService.signIn(username, password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    console.log('User in Request:', req.user);
    return req.user;
  }
}
