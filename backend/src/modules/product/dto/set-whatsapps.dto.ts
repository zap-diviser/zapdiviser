import { IsString } from 'class-validator';

export class setWhatsappsDto {
  @IsString()
  whatsappId: string;
}
