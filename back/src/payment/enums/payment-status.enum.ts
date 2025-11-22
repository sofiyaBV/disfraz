export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  PROCESSING = 'processing',
  REQUIRES_ACTION = 'requires_action',
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  CANCELED = 'canceled',
  FAILED = 'failed',
}
