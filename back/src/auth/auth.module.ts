import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '36000s' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Глобально застосовуємо AuthGuard
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
