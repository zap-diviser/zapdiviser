import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { MessageEntity } from './entities/message.entity';
import { UserModule } from '../user/user.module';
import { NestMinioModule } from 'nestjs-minio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, MessageEntity]),
    UserModule,
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
  exports: [ChatService],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
