import { Module } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { RedirectsController } from './redirects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedirectEntity } from './entities/redirect.entity';
import { RedirectLinkEntity } from './entities/redirect-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RedirectEntity, RedirectLinkEntity])],
  controllers: [RedirectsController],
  providers: [RedirectsService],
})
export class RedirectsModule {}
