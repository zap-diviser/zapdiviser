import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FlowEventConsumer } from './jobs/flow-event.consumer';
import { ProductModule } from '../product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'flow-event-queue',
    }),
    ProductModule,
  ],
  providers: [FlowEventConsumer],
})
export class BullManagerModule {}
