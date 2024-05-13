import { Injectable } from '@nestjs/common';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import Queue from 'bull';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    protected readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    protected readonly messageRepository: Repository<MessageEntity>,
    protected readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async handleMessage(
    content: any,
    phone: string,
    instanceId: string,
    fromMe = false,
  ) {
    const user = await this.userService.getByInstanceId(instanceId);

    let chat = await this.chatRepository.findOne({
      where: {
        phone,
        user: {
          id: user.id,
        },
      },
    });

    if (!chat) {
      chat = await this.chatRepository.save({
        phone,
        currentWhatsapp: { id: instanceId },
        user: { id: user.id },
      });
    }

    await this.messageRepository.save({
      content,
      fromMe,
      chat,
    });
  }

  async sendMessage(userId: string, to: string, content: string) {
    const chat = await this.chatRepository.findOneOrFail({
      where: { phone: to, user: { id: userId } },
    });

    const queue = new Queue(`MessagesSender:${chat.currentWhatsapp.id}`, {
      redis: this.configService.get<string>('REDIS_URL'),
    });

    await queue.add('sendMessage', {
      to,
      content: content,
    });
  }

  async getChats(userId: string) {
    return await this.chatRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async getMessages(userId: string, chatId: string) {
    return await this.messageRepository.find({
      where: { chat: { id: chatId, user: { id: userId } } },
    });
  }
}
