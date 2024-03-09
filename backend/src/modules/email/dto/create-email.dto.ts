import { IsEmail, IsObject, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  email_subject: string;

  @IsString()
  email_template: string;

  @IsObject()
  params: any;
}
