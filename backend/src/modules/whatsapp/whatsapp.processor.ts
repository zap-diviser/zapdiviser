import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappGateway } from './whatsapp.gateway';
import { WhatsappService } from './whatsapp.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Status } from './entities/whatsapp.entity';

type Event<T> = Job<{ instanceId: string; data: T }>;

@Processor('FlowTriggers')
export class WhatsappConsumer {
  constructor(
    private readonly gateway: WhatsappGateway,
    private readonly whatsappService: WhatsappService,
    private readonly redisService: RedisService,
  ) {}

  @Process('qr')
  async onQr({ data: { instanceId, data } }: Event<string>) {
    const redis = this.redisService.getClient();
    await redis.set(`whatsapp-${instanceId}-qr`, data, 'EX', 60);
    this.gateway.io.to(instanceId).emit('qr', data);
  }

  @Process('connecting')
  async onConnecting({ data: { instanceId } }: Event<void>) {
    await this.whatsappService.setStatus(instanceId, Status.CONNECTING);
    this.gateway.io.to(instanceId).emit('whatsapp-connecting');
  }

  @Process('connected')
  async onConnected({ data: { instanceId, data } }: Event<{ phone: string }>) {
    const updatedWhatsapp = await this.whatsappService.setWhatsappPhone(
      instanceId,
      data.phone,
    );

    if (!updatedWhatsapp) return;

    this.gateway.io.to(instanceId).emit('whatsapp-connected', updatedWhatsapp);
  }

  @Process('banned')
  async onBanned({ data: { instanceId } }: Event<void>) {
    await this.whatsappService.setStatus(instanceId, Status.BANNED);
  }

  @Process('disconnected')
  async onDisconnected({ data: { instanceId } }: Event<void>) {
    await this.whatsappService.setStatus(instanceId, Status.CONNECTING);
  }

  @Process('stopped')
  async onStop({ data: { instanceId } }: Event<void>) {
    await this.whatsappService.setStatus(instanceId, Status.PAUSED);
  }

  @Process('logout')
  async onLogout({ data: { instanceId } }: Event<void>) {
    await this.whatsappService.setWhatsappPhone(instanceId, null);
  }
}
