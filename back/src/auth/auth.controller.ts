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
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getFrontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:4114';
  }
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
    return this.authService.signIn(
      signInDto.email,
      signInDto.phone,
      signInDto.password,
    );
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
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; access_token?: string }> {
    const user = await this.authService.register(createUserDto);

    if (user) {
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };
      const access_token = await this.authService.generateJwtToken(payload);

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
  getProfile(@Request() req) {
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
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Авторизація через Google' })
  @ApiResponse({ status: 302, description: 'Перенаправлення на Google' })
  async googleAuth(@Request() req) {}

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
    const frontendUrl = this.getFrontendUrl();

    if (!user || !user.access_token) {
      return res.redirect(`${frontendUrl}/?error=google_auth_failed`);
    }

    return res.redirect(`${frontendUrl}/?token=${user.access_token}`);
  }
}
