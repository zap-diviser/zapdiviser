import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Redis } from 'ioredis';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WhatsappGateway {
  constructor(@InjectRedis() private readonly redisService: Redis) {}
  @WebSocketServer() io: Server;

  @SubscribeMessage('createWhatsapp')
  async handleMessage(client: Socket, { instanceId }: { instanceId: string }) {
    client.join(instanceId);
    const redis = await this.redisService;
    const hasQRCodeSaved = await redis.get(`whatsapp-${instanceId}-qr`);
    if (!hasQRCodeSaved) return;
    client.emit('qr', await redis.get(`whatsapp-${instanceId}-qr`));
  }
}
