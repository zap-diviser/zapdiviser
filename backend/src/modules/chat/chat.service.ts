import { Injectable } from '@nestjs/common';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    protected readonly charRepository: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    protected readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async sendMessage(content: any, chatId: string) {
    await this.messageRepository.save({
      content,
      fromMe: true,
      chat: { id: chatId },
    });
  }

  async receiveMessage(content: any, chatId: string) {
    await this.messageRepository.save({
      content,
      fromMe: false,
      chat: { id: chatId },
    });
  }

  async createChat() {
    return await this.charRepository.save({});
  }

  async getChat(id: string) {
    return await this.charRepository.findOne({
      where: { id },
      relations: ['messages'],
    });
  }

  async getChats() {
    return await this.charRepository.find({});
  }
}
