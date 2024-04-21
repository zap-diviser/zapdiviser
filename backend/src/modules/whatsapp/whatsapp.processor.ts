import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappGateway } from './whatsapp.gateway';
import { WhatsappService } from './whatsapp.service';
import { RedisService } from 'nestjs-redis-cluster';
import { Status } from './entities/whatsapp.entity';

@Processor('FlowTriggers')
export class WhatsappConsumer {
  constructor(
    private readonly gateway: WhatsappGateway,
    private readonly whatsappService: WhatsappService,
    private readonly redisService: RedisService,
  ) {}

  @Process('Whatsapp')
  async transcode(job: Job<{ instanceId: string; event: string; data: any }>) {
    const { data } = job;
    const redis = this.redisService.getClient();

    switch (data.event) {
      case 'qr':
        await redis.set(`whatsapp-${data.instanceId}-qr`, data.data, 'EX', 60);
        this.gateway.io.to(data.instanceId).emit('qr', data.data);
        break;
      case 'connecting':
        await this.whatsappService.setStatus(
          data.instanceId,
          Status.CONNECTING,
        );
        this.gateway.io.to(data.instanceId).emit('whatsapp-connecting');
        break;
      case 'connected':
        const updatedWhatsapp = await this.whatsappService.setWhatsappPhone(
          data.instanceId,
          data.data.phone,
        );

        if (!updatedWhatsapp) return;

        this.gateway.io
          .to(data.instanceId)
          .emit('whatsapp-connected', updatedWhatsapp);
        break;
      case 'banned':
        await this.whatsappService.setStatus(data.instanceId, Status.BANNED);
      case 'disconnected':
        await this.whatsappService.setStatus(
          data.instanceId,
          Status.CONNECTING,
        );
      case 'stopped':
        await this.whatsappService.setStatus(data.instanceId, Status.PAUSED);
      case 'logout':
        await this.whatsappService.setWhatsappPhone(data.instanceId, null);
    }
  }
}
