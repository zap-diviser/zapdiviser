import { Injectable } from '@nestjs/common';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import Queue from 'bull';
import { WhatsappEntity } from '../whatsapp/entities/whatsapp.entity';

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
    instance: WhatsappEntity,
    fromMe: boolean,
  ) {
    let chat = await this.chatRepository.findOne({
      where: {
        phone,
        user: {
          id: instance.user_id,
        },
      },
    });

    console.log(content);

    if (!chat) {
      chat = await this.chatRepository.save({
        phone,
        currentWhatsapp: instance,
        user: instance.user,
      });
    }

    this.messageRepository.save({
      content,
      fromMe,
      chat,
    });
  }

  async sendMessage(userId: string, to: string, content: any) {
    const chat = await this.chatRepository.findOneOrFail({
      where: { id: to, user: { id: userId } },
      relations: { currentWhatsapp: true },
    });

    const queue = new Queue(`MessagesSender:${chat.currentWhatsapp.id}`, {
      redis: this.configService.get<string>('REDIS_URL'),
    });

    await queue.add('sendMessage', {
      to: chat.phone,
      content: content.text,
    });
  }

  async getChats(userId: string) {
    return await this.chatRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getMessages(userId: string, chatId: string) {
    return await this.messageRepository.find({
      where: { chat: { id: chatId, user: { id: userId } } },
    });
  }
}
