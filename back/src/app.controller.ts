import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; // Імпорт AuthGuard
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './auth/enums/role.enum';
@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('check-db')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  async checkDbConnection(): Promise<string> {
    return this.appService.checkDatabaseConnection();
  }
}
