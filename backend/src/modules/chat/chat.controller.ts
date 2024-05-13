import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDTO } from './dto/send-message.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  async sendMessage(@Req() req, @Body() { to, content }: SendMessageDTO) {
    return await this.chatService.sendMessage(req.user.id, content, to);
  }

  @Get('chats')
  async getChats(@Req() req) {
    return await this.chatService.getChats(req.user.id);
  }

  @Get('chat/:id/messages')
  async getMessages() {
    return [];
  }
}
