import { ApiProperty } from '@nestjs/swagger';

export class StripeWebhookEventDto {
  @ApiProperty({
    description: 'Тип події',
    example: 'payment_intent.succeeded',
  })
  type: string;

  @ApiProperty({ description: 'Дані події' })
  data: {
    object: any;
  };
}
