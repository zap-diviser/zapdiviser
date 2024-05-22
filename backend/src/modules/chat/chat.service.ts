import { Injectable, HttpException } from '@nestjs/common';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import Queue from 'bull';
import { Status, WhatsappEntity } from '../whatsapp/entities/whatsapp.entity';

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
    name: string,
    fromMe: boolean,
  ) {
    let chat = await this.chatRepository.findOne({
      where: {
        phone,
        user: { id: instance.user_id },
      },
    });

    if (chat === null) {
      const data: Partial<ChatEntity> = {
        phone,
        user: instance.user,
        currentWhatsapp: instance,
        name: phone,
      };

      if (name !== null) {
        data.name = name;
      }

      chat = await this.chatRepository.save(data);
    } else {
      if (name !== null) {
        chat.name = name;
        await chat.save();
      } else if (chat.name === null) {
        chat.name = phone;
        await chat.save();
      }
    }

    this.messageRepository.save({
      content,
      fromMe,
      chat: chat!,
    });
  }

  async sendMessage(userId: string, to: string, content: any) {
    const chat = await this.chatRepository.findOneOrFail({
      where: { id: to, user: { id: userId } },
      relations: { currentWhatsapp: true },
    });

    if (
      !chat.currentWhatsapp ||
      chat.currentWhatsapp.status !== Status.CONNECTED
    ) {
      const user = await this.userService.getById(userId);
      const whatsapps = user.whatsapps.filter(
        (whatsapp) => whatsapp.status === Status.CONNECTED,
      );
      if (!whatsapps.length) {
        throw new HttpException('No connected whatsapps', 500);
      }
      const whatsapp = whatsapps[Math.floor(Math.random() * whatsapps.length)];
      chat.currentWhatsapp = whatsapp;
      await chat.save();
    }

    const queue = new Queue(`MessagesSender:${chat.currentWhatsapp.id}`, {
      redis: this.configService.get<string>('REDIS_URL'),
    });

    await queue.add('sendMessage', {
      to: chat.phone,
      content: content.text,
    });
  }

  async unlinkWhatsapp(userId: string, chatId: string) {
    const chat = await this.chatRepository.findOneOrFail({
      where: { id: chatId, user: { id: userId } },
    });

    chat.currentWhatsapp = null;
    await chat.save();
  }

  async updateLastInteraction(
    instance: WhatsappEntity,
    phone: string,
    timestamp: number,
  ) {
    const chat = await this.chatRepository.findOneOrFail({
      where: { phone, user: { id: instance.user_id } },
    });

    chat.lastInteraction = new Date(timestamp);
    await chat.save();
  }

  async getChats(userId: string) {
    return await this.chatRepository.find({
      where: { user: { id: userId } },
      order: { lastInteraction: 'ASC' },
    });
  }

  async getMessages(userId: string, chatId: string) {
    return await this.messageRepository.find({
      where: { chat: { id: chatId, user: { id: userId } } },
    });
  }

  async deleteAll() {
    await this.messageRepository.delete({});
    await this.chatRepository.delete({});
  }
}
