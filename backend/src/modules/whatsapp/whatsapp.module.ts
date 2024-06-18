import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappEntity } from './entities/whatsapp.entity';
import { BullModule } from '@nestjs/bull';
import { WhatsappConsumer } from './whatsapp.processor';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsappEntity]),
    BullModule.registerQueueAsync({
      name: 'FlowTriggers',
    }),
    ChatModule,
  ],
  exports: [WhatsappService],
  controllers: [WhatsappController],
  providers: [WhatsappService, WhatsappConsumer],
})
export class WhatsappModule {}
