import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappGateway } from './whatsapp.gateway';
import { WhatsappService } from './whatsapp.service';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Processor('FlowTriggers')
export class WhatsappConsumer {
  constructor(
    private readonly gateway: WhatsappGateway,
    private readonly whatsappService: WhatsappService,
    private readonly redisService: RedisService,
  ) {}

  @Process('Whatsapp')
  async transcode(job: Job<any>) {
    const { data } = job;

    console.log('WhatsappConsumer -> transcode -> data', data);

    switch (data.event) {
      case 'qr':
        const redis = this.redisService.getClient();
        await redis.set(`whatsapp-${data.instanceId}-qr`, data.data, 'EX', 60);
        this.gateway.io.to(data.instanceId).emit('qr', data.data);
        break;
      case 'connecting':
        this.gateway.io.to(data.instanceId).emit('whatsapp-connecting');
        break;
      case 'connected':
        const updatedWhatsapp = await this.whatsappService.setWhatsappPhone(
          data.instanceId,
          data.data.phone,
        );

        console.log(
          'WhatsappConsumer -> transcode -> updatedWhatsapp',
          updatedWhatsapp,
        );

        if (!updatedWhatsapp) return;

        console.log('sending');
        this.gateway.io
          .to(data.instanceId)
          .emit('whatsapp-connected', updatedWhatsapp);
        break;
    }
  }
}
