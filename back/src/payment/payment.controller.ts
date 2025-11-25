import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Payment } from './entities/payment.entity';
import { User } from '../auth/decorators/user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { RequestUser } from '../common/interfaces/request.interface';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Створити новий платіж' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Платіж успішно створено',
    type: Payment,
  })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @User() user: RequestUser,
  ) {
    return this.paymentService.create(createPaymentDto, user.id);
  }

  @Post('create-checkout-session')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Створити Stripe Checkout Session' })
  @ApiBody({ type: CreateCheckoutSessionDto })
  @ApiResponse({
    status: 201,
    description: 'Checkout session успішно створено',
  })
  createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
    @User() user: RequestUser,
  ) {
    return this.paymentService.createCheckoutSession(
      createCheckoutSessionDto,
      user.id,
    );
  }

  @Public()
  @Post('webhook')
  @ApiExcludeEndpoint()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(req.rawBody, signature);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Отримати список усіх платежів' })
  @ApiResponse({ status: 200, description: 'Список платежів', type: [Payment] })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Отримати платіж за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID платежу',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Платіж знайдено', type: Payment })
  @ApiResponse({ status: 404, description: 'Платіж не знайдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }
}
