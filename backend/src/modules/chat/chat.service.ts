import { Injectable, HttpException } from '@nestjs/common';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import Queue from 'bull';
import { Status, WhatsappEntity } from '../whatsapp/entities/whatsapp.entity';
import { InjectMinio } from 'nestjs-minio';
import { Client } from 'minio';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    protected readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    protected readonly messageRepository: Repository<MessageEntity>,
    protected readonly userService: UserService,
    private readonly configService: ConfigService,
    @InjectMinio() private readonly minioClient: Client,
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

  async setWhatsapp(userId: string, chatId: string, whatsappId: string) {
    await this.chatRepository.update(
      {
        id: chatId,
        user: { id: userId },
      },
      {
        currentWhatsapp: { id: whatsappId },
      },
    );
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
      throw new HttpException('Whatsapp no conected', 500);
    }

    const queue = new Queue(`MessagesSender:${chat.currentWhatsapp.id}`, {
      redis: this.configService.get<string>('REDIS_URL'),
    });

    switch (content.type) {
      case 'file':
        await queue.add('sendFile', {
          to: chat.phone,
          file: content.file,
          file_type: content.file_type,
        });
        break;
      case 'text':
        await queue.add('sendMessage', {
          to: chat.phone,
          content: content.content,
        });
        break;
    }

    chat.lastInteraction = new Date();
    await chat.save();
  }

  async unlinkWhatsapp(userId: string, whatsappId: string) {
    await this.chatRepository.update(
      {
        currentWhatsapp: { id: whatsappId },
        user: { id: userId },
      },
      { currentWhatsapp: null },
    );
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
      order: { lastInteraction: 'DESC' },
      relations: { currentWhatsapp: true },
    });
  }

  async getMessages(userId: string, chatId: string) {
    return await this.messageRepository.find({
      where: { chat: { id: chatId, user: { id: userId } } },
      relations: {
        chat: { currentWhatsapp: true },
      },
      order: { created_at: 'ASC' },
    });
  }

  async deleteAll() {
    await this.messageRepository.delete({});
    await this.chatRepository.delete({});
  }

  async createUploadUrl(user_id: string) {
    const id = `${user_id}/${new Date().getTime()}`;

    const upload_url = await this.minioClient.presignedPutObject(
      'zapdiviser',
      id,
      60 * 60,
    );

    return {
      upload_url,
      id,
    };
  }

  async createDownloadUrl(id: string) {
    const download_url = await this.minioClient.presignedGetObject(
      'zapdiviser',
      id,
      60 * 60,
    );

    return {
      download_url,
      id,
    };
  }
}
