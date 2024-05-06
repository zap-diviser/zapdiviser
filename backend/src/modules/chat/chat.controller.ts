import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDTO } from './dto/send-message.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  async sendMessage(@Body() { to, content }: SendMessageDTO) {
    return await this.chatService.sendMessage(content, to);
  }
}
