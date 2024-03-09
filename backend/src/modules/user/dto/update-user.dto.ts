import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  // The name of the user.
  @IsString()
  @IsOptional()
  name: string;

  // The phone number of the user.
  @IsString()
  @IsOptional()
  phone: string;

  @IsBoolean()
  @IsOptional()
  has_installed: boolean;

  @IsBoolean()
  @IsOptional()
  has_downloaded: boolean;
}
