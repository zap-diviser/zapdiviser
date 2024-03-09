import { PartialType } from '@nestjs/swagger';
import { CreateRedirectLinkDto } from './create-redirect-link.dto';

export class UpdateRedirectLinkDto extends PartialType(CreateRedirectLinkDto) {}
