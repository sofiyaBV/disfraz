import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // Импортируем стратегию
import { JwtAuthGuard } from './jwt-auth.guard'; // Импортируем guard

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'your_secret_key', // Укажите ваш секретный ключ
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // Регистрируем стратегию и guard
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
