import { IsString } from 'class-validator';

export class LoginUserDto {
  //The username of the user.
  @IsString()
  email: string;

  // The password of the user.
  @IsString()
  password: string;
}
