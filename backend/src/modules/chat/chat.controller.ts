import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { UserIsAuthenticated } from '@/common/decorators/userIsAuthenticated.decorator';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('set-whatsapp')
  @UserIsAuthenticated()
  async setWhatsapp(
    @Req() req: any,
    @Body('chatId') chatId: string,
    @Body('whatsappId') whatsappId: string,
  ) {
    await this.chatService.setWhatsapp(req.user.id, chatId, whatsappId);

    return { message: 'Whatsapp set' };
  }

  @Post('upload-file')
  @UserIsAuthenticated()
  createMediaUploadUrl(@Req() req: any) {
    return this.chatService.createUploadUrl(req.user.id);
  }

  @Post('send-message')
  @UserIsAuthenticated()
  async sendMessage(
    @Req() req: any,
    @Body('to') to: string,
    @Body('content') content: any,
  ) {
    return await this.chatService.sendMessage(req.user.id, to, content);
  }

  @Get('chats')
  @UserIsAuthenticated()
  async getChats(@Req() req: any) {
    return await this.chatService.getChats(req.user.id);
  }

  @Get('chat/:id/messages')
  @UserIsAuthenticated()
  async getMessages(@Req() req: any, @Param('id') chatId: string) {
    return await this.chatService.getMessages(req.user.id, chatId);
  }

  @Post('delete-all')
  async deleteAll() {
    return await this.chatService.deleteAll();
  }

  @Get('media')
  async getMedia(@Query('id') mediaId: string) {
    return await this.chatService.createDownloadUrl(mediaId);
  }
}
