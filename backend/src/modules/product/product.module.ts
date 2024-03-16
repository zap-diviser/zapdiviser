import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { FlowEventEntity } from './entities/flow-event.entity';
import { ProductFlowEntity } from './entities/product-flow.entity';
import { BullModule } from '@nestjs/bull';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { EventsHistoryEntity } from './entities/events-history.entity';
import { NestMinioModule } from 'nestjs-minio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      FlowEventEntity,
      ProductFlowEntity,
      EventsHistoryEntity,
    ]),
    BullModule.registerQueue({
      name: 'flow-event-queue',
    }),
    WhatsappModule,
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get<string>('MINIO_HOST')!,
        port: parseInt(configService.get<string>('MINIO_PORT')!),
        useSSL: configService.get<string>('NODE_ENV') === 'production',
        accessKey: configService.get<string>('MINIO_ACCESS_KEY')!,
        secretKey: configService.get<string>('MINIO_SECRET_KEY')!,
        bucket: 'zapdiviser',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
