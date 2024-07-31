import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue as IQueue } from 'bull';
import { WhatsappService } from './whatsapp.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Status } from './entities/whatsapp.entity';
import { ChatService } from '../chat/chat.service';
import pusher from '../../pusher';
import { FlowEventEntity } from '@/modules/product/entities/flow-event.entity';

type Event<T> = Job<{ instanceId: string; data: T }>;

interface IFlowEvent {
  id: string;
  product_id: string;
  events: Array<
    FlowEventEntity & {
      metadata: any;
    }
  >;
  phone: string;
  name: string;
  instanceId: string;
  created_at: Date;
}

interface IFlowEvent {
  id: string;
  product_id: string;
  events: Array<
    FlowEventEntity & {
      metadata: any;
    }
  >;
  phone: string;
  name: string;
  instanceId: string;
  created_at: Date;
}

@Processor('FlowTriggers')
export class WhatsappConsumer {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly redisService: RedisService,
    private readonly chatService: ChatService,
    @InjectQueue('flow-event-queue')
    private readonly reservaCotaQueue: IQueue<IFlowEvent>,
  ) {}

  @Process('qr')
  async onQr({ data: { instanceId, data } }: Event<string>) {
    const redis = this.redisService.getClient();
    await redis.set(`whatsapp-${instanceId}-qr`, data, 'EX', 60);
    pusher.trigger(`whatsapp-${instanceId}`, 'qr', data);
  }

  @Process('connecting')
  async onConnecting({ data: { instanceId } }: Event<void>) {
    await this.whatsappService.setStatus(instanceId, Status.CONNECTING);
    pusher.trigger(`whatsapp-${instanceId}`, 'whatsapp-connecting', {});
  }

  @Process('connected')
  async onConnected({ data: { instanceId, data } }: Event<{ phone: string }>) {
    const updatedWhatsapp = await this.whatsappService.setWhatsappPhone(
      instanceId,
      data.phone,
    );

    if (!updatedWhatsapp) return;

    pusher.trigger(
      `whatsapp-${instanceId}`,
      'whatsapp-connected',
      updatedWhatsapp,
    );

    await this.whatsappService.stopOldWhatsapp(instanceId);
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

  @Process('message')
  async onMessage({
    data: {
      instanceId,
      data: { to, content, fromMe, name },
    },
  }: Event<{
    from: string;
    to: string;
    content: string;
    name: string;
    fromMe: boolean;
  }>) {
    await this.chatService.handleMessage(
      content,
      to,
      await this.whatsappService.getInstance(instanceId),
      name,
      fromMe,
    );

    const productId =
      await this.whatsappService.getProductIdFromInstance(instanceId);

    const redis = this.redisService.getClient();

    const data = await redis.get(`flow:${productId}:${to}`);

    if (!data) return;

    const events = JSON.parse(data);

    this.reservaCotaQueue.add('data-event-process', {
      ...events,
      created_at: new Date(),
    });
  }

  @Process('chat-last-interaction')
  async onChatLastInteraction({
    data: {
      instanceId,
      data: { phone, lastInteraction },
    },
  }: Event<{ phone: string; lastInteraction: number }>) {
    await this.chatService.updateLastInteraction(
      await this.whatsappService.getInstance(instanceId),
      phone,
      lastInteraction,
    );
  }

  @Process('error')
  async onError({ data: { instanceId, data } }: Event<{ error: string }>) {
    await this.whatsappService.setStatus(instanceId, Status.PAUSED);
    pusher.trigger(`whatsapp-${instanceId}`, 'whatsapp-error', data.error);
  }
}
