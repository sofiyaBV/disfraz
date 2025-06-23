import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });

    // Логируем конфигурацию
    this.logger.log('Google Strategy инициализирован');
    this.logger.log(
      `Client ID: ${configService.get<string>('GOOGLE_CLIENT_ID')?.substring(0, 20)}...`,
    );
    this.logger.log(
      `Callback URL: ${configService.get<string>('GOOGLE_CALLBACK_URL')}`,
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      this.logger.log('Google OAuth validate вызван');
      this.logger.log(`Profile: ${JSON.stringify(profile, null, 2)}`);

      const { name, emails, id } = profile;
      const email = emails[0]?.value;

      if (!email) {
        this.logger.error('Email не найден в профиле Google');
        return done(new Error('Email not found in Google profile'), null);
      }

      // Находим или создаем пользователя
      const user = await this.authService.findOrCreateGoogleUser({
        email,
        googleId: id,
        firstName: name?.givenName,
        lastName: name?.familyName,
      });

      this.logger.log(`Пользователь найден/создан: ${user.id}`);

      // Создаем JWT токен
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      const jwtToken = await this.authService.generateJwtToken(payload);
      this.logger.log('JWT токен создан');

      return done(null, { ...user, access_token: jwtToken });
    } catch (error) {
      this.logger.error('Ошибка в Google OAuth validate:', error);
      return done(error, null);
    }
  }
}
