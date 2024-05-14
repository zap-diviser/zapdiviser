import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { UserIsAuthenticated } from '@/common/decorators/userIsAuthenticated.decorator';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
}
