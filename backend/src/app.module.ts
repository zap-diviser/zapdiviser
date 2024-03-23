/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
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
import { LoggerModule } from 'nestjs-pino';
import configuration from './config';

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
      useFactory: (configService: ConfigService) => ({
        config: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(configOptions),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    AdminJsModule,
    UserModule,
    AuthModule,
    EmailModule,
    RedirectsModule,
    ProductModule,
    WhatsappModule,
  ],
})
export class AppModule {}
