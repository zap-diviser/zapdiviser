import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDTO {
  to: string;

  @ApiProperty({
    type: Object,
    description: 'Message content',
  })
  content: any;
}
