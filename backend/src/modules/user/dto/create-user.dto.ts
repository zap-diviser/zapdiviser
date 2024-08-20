/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsEmail, IsNumberString, IsString } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  phone: string;

  @IsString()
  password: string;
}
