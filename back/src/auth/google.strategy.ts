import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';

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
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { name, emails, id } = profile;
      const email = emails[0]?.value;

      if (!email) {
        this.logger.error('Email not found in Google profile');
        return done(new Error('Email not found in Google profile'), null);
      }

      const user = await this.authService.findOrCreateGoogleUser({
        email,
        googleId: id,
        firstName: name?.givenName,
        lastName: name?.familyName,
      });

      this.logger.debug(`Google OAuth success for user ID: ${user.id}`);

      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      const jwtToken = await this.authService.generateJwtToken(payload);

      return done(null, { ...user, access_token: jwtToken });
    } catch (error) {
      this.logger.error(
        'Google OAuth validation error',
        error instanceof Error ? error.message : 'Unknown error',
      );
      return done(error, null);
    }
  }
}
