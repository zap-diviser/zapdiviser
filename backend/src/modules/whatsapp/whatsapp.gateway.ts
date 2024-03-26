import { RedisService } from 'nestjs-redis-cluster';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WhatsappGateway {
  constructor(private readonly redisService: RedisService) {}
  @WebSocketServer() io: Server;

  @SubscribeMessage('createWhatsapp')
  async handleMessage(client: Socket, { instanceId }: { instanceId: string }) {
    client.join(instanceId);
    const redis = await this.redisService.getClient();
    const hasQRCodeSaved = await redis.get(`whatsapp-${instanceId}-qr`);
    if (!hasQRCodeSaved) return;
    client.emit('qr', await redis.get(`whatsapp-${instanceId}-qr`));
  }
}
