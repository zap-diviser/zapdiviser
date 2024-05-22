import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  Post,
  Body,
  Headers,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappEntity } from './entities/whatsapp.entity';
import { UserIsAuthenticated } from '@/common/decorators/userIsAuthenticated.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('whatsapp')
@ApiTags('Whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  @UserIsAuthenticated()
  @ApiOkResponse({
    type: [WhatsappEntity],
  })
  findAll(@Req() req): Promise<WhatsappEntity[]> {
    return this.whatsappService.findAll(req.user.id);
  }

  @Post('update-code')
  updateCode() {
    return this.whatsappService.updateCode();
  }

  @Post()
  @UserIsAuthenticated()
  @ApiOkResponse({
    type: WhatsappEntity,
  })
  create(@Req() req: any): Promise<WhatsappEntity> {
    return this.whatsappService.create(req.user.id);
  }

  @Get(':id')
  @UserIsAuthenticated()
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.whatsappService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @UserIsAuthenticated()
  remove(@Param('id') id: string, @Req() req) {
    return this.whatsappService.remove(id, req.user.id);
  }

  @Post('webhook')
  webhook(@Headers() headers: Record<string, string>, @Body() body: any) {
    return this.whatsappService.webhook(body, headers['X-Hub-Signature-256']);
  }

  @Post('update')
  update() {
    return this.whatsappService.updateAll();
  }
}
