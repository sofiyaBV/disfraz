import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { HandleCallbackDto } from './dto/HandleCallback.Dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Payment } from './entities/payment.entity';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Створити новий платіж' })
  @ApiResponse({
    status: 201,
    description: 'Платіж успішно створено',
    type: Object,
  })
  create(@Body() createPaymentDto: CreatePaymentDto, @User() user: any) {
    return this.paymentService.create(createPaymentDto, user.id);
  }

  @Post('/callback')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Обробити callback для платежу' })
  @ApiResponse({
    status: 200,
    description: 'Callback успішно оброблено',
    type: Payment,
  })
  handleCallback(@Body() handleCallbackDto: HandleCallbackDto) {
    return this.paymentService.handleCallback(handleCallbackDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Отримати список усіх платежів' })
  @ApiResponse({ status: 200, description: 'Список платежів', type: [Payment] })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Отримати платіж за ID' })
  @ApiResponse({ status: 200, description: 'Платіж знайдено', type: Payment })
  @ApiResponse({ status: 404, description: 'Платіж не знайдено' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }
}
