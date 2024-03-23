import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FlowEventConsumer } from './jobs/flow-event.consumer';
import { ProductModule } from '../product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowEventEntity } from '../product/entities/flow-event.entity';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([FlowEventEntity]),
    BullModule.registerQueue({
      name: 'flow-event-queue',
    }),
    ProductModule,
  ],
  providers: [FlowEventConsumer],
})
export class BullManagerModule {}
