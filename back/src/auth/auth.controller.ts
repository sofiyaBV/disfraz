import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { RequestWithUser } from '../common/interfaces/request.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RolesGuard } from './guards/roles.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getFrontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:4114';
  }

  private setAuthCookie(res: Response, token: string): void {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизація користувача' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    type: SignInResponseDto,
    description: 'Успішний вхід',
  })
  @ApiResponse({ status: 401, description: 'Помилка авторизації' })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseDto> {
    const result = await this.authService.signIn(
      signInDto.email,
      signInDto.phone,
      signInDto.password,
    );

    this.setAuthCookie(res, result.access_token);

    return result;
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Користувач успішно зареєстрований',
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані' })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; access_token?: string }> {
    const user = await this.authService.register(createUserDto);

    if (user) {
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };
      const access_token = await this.authService.generateJwtToken(payload);

      this.setAuthCookie(res, access_token);

      return {
        message: 'Користувач успішно зареєстрований',
        access_token,
      };
    }

    return { message: 'Користувач успішно зареєстрований' };
  }

  @Get('profile')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримання профілю користувача' })
  @ApiResponse({ status: 200, description: 'Інформація про користувача' })
  @ApiResponse({ status: 401, description: 'Неавторизований запит' })
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Put('profile')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновлення профілю користувача' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Профіль успішно оновлено' })
  @ApiResponse({ status: 401, description: 'Неавторизований запит' })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  @Post('logout')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вихід з системи' })
  @ApiResponse({ status: 200, description: 'Успішний вихід з системи' })
  @ApiResponse({ status: 401, description: 'Неавторизований запит' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Успішний вихід з системи' };
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Авторизація через Google' })
  @ApiResponse({ status: 302, description: 'Перенаправлення на Google' })
  async googleAuth() {}

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Callback для Google авторизації' })
  @ApiResponse({
    status: 200,
    description: 'Успішна авторизація через Google',
  })
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    const user = req.user;
    const frontendUrl = this.getFrontendUrl();

    if (!user || !user.access_token) {
      return res.redirect(`${frontendUrl}/?error=google_auth_failed`);
    }

    this.setAuthCookie(res, user.access_token);

    return res.redirect(`${frontendUrl}/?oauth=success`);
  }
}
