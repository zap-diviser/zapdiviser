import { IsString } from 'class-validator';

export class CheckCodeDto {
  @IsString()
  code: string;

  @IsString()
  email: string;
}
