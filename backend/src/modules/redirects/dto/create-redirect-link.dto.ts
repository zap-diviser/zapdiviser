import { IsString } from 'class-validator';

export class CreateRedirectLinkDto {
  @IsString()
  link: string;
}
