/* eslint-disable @typescript-eslint/no-var-requires */
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { configOptions } from './ormconfig';
import { RedirectsModule } from './modules/redirects/redirects.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductModule } from './modules/product/product.module';
import { BullManagerModule } from './modules/bull/bull.module';
import { AdminJsModule } from './modules/admin/adminjs.module';
import configuration from './config';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import LokiTransport from 'winston-loki';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    BullManagerModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          config: {
            url: configService.get('REDIS_URL'),
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(configOptions),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const transports: winston.transport[] = [
          new winston.transports.Console(),
        ];

        if (configService.get('NODE_ENV') === 'production') {
          transports.push(
            new LokiTransport({
              host: 'http://loki:3100',
            }),
          );
        }
        return {
          transports,
        };
      },
      inject: [ConfigService],
    }),
    AdminJsModule,
    UserModule,
    AuthModule,
    EmailModule,
    RedirectsModule,
    ProductModule,
    WhatsappModule,
    NotificationsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
