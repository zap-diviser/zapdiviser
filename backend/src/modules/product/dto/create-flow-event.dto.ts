import { IsIn, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateFlowEventDto {
  @IsString()
  @IsIn([
    'card_approved',
    'card_declined',
    'pix_generated',
    'pix_approved',
    'cart_abandoned',
    'form_submitted',
  ])
  flow_name:
    | 'card_approved'
    | 'card_declined'
    | 'pix_generated'
    | 'pix_approved'
    | 'cart_abandoned'
    | 'form_submitted';

  @IsString()
  product_id: string;

  @IsObject()
  metadata: {
    message?: string;
    delay?: number;
  };

  @IsString()
  @IsIn(['message', 'delay', 'file', 'wait_for_message'])
  type: string;

  @IsNumber()
  sort: number;
}
