import { IsIn, IsObject, IsString } from 'class-validator';

export class UpdateFlowEventDto {
  @IsObject()
  metadata: {
    message: string;
  };

  @IsString()
  @IsIn(['message', 'delay', 'file'])
  type: string;
}
