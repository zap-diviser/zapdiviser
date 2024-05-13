import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { MessageEntity } from './entities/message.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, MessageEntity]), UserModule],
  exports: [ChatService],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
