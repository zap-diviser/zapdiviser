import { IsString } from 'class-validator';

export class ForgetPasswordWithCodeDto {
  @IsString()
  code: string;

  @IsString()
  email: string;

  @IsString()
  newPassword: string;
}
