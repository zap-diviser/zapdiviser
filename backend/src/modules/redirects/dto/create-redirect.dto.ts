import { IsObject, IsString } from 'class-validator';

export class CreateRedirectDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsObject({ each: true })
  links: any[];
}
