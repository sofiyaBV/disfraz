import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
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
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, id: googleId } = profile;
    const email = emails[0]?.value;

    if (!email) {
      return done(new Error('Email not found in Google profile'), null);
    }

    let user = await this.authService.findOrCreateGoogleUser({
      email,
      googleId,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const jwtToken = await this.authService.generateJwtToken(payload);

    return done(null, { ...user, access_token: jwtToken });
  }
}
