/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';

class Costumer {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  phone: string;

  @IsString()
  password: string;
}

export default class CreateUserDto {
  @Type(() => Costumer)
  @ValidateNested()
  readonly costumer: Costumer;
}
