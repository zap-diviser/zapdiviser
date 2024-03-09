import { PartialType } from '@nestjs/swagger';
import { CreateRedirectDto } from './create-redirect.dto';

export class UpdateRedirectDto extends PartialType(CreateRedirectDto) {}
