import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappEntity } from './entities/whatsapp.entity';
import { BullModule } from '@nestjs/bull';
import { WhatsappGateway } from './whatsapp.gateway';
import { WhatsappConsumer } from './whatsapp.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsappEntity]),
    BullModule.registerQueueAsync({
      name: 'FlowTriggers',
    }),
  ],
  exports: [WhatsappService],
  controllers: [WhatsappController],
  providers: [WhatsappService, WhatsappGateway, WhatsappConsumer],
})
export class WhatsappModule {}
