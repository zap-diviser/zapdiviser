import { IsString } from 'class-validator';

export class LoginUserDto {
  //The username of the user.
  @IsString()
  email = 'string@email.com';

  // The password of the user.
  @IsString()
  password: string;
}
