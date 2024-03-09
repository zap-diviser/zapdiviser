import { IsString } from 'class-validator';

export class RemoveWhatsappDto {
  @IsString()
  whatsappId: string;
}
