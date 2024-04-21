import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FlowEventConsumer } from './jobs/flow-event.consumer';
import { ProductModule } from '../product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowEventEntity } from '../product/entities/flow-event.entity';
import Redis from 'ioredis';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const client = new Redis.Cluster(
          configService
            .get<string>('REDIS_URLS')!
            .split(';')
            .map((url) => {
              const [host, port] = url.split(':');

              return {
                host,
                port: parseInt(port),
              };
            }),
          {
            enableReadyCheck: false,
          },
        );

        return {
          createClient: () => {
            return client;
          },
        };
      },
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
