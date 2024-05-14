import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WhatsappGateway {
  constructor() {}
  @WebSocketServer() io: Server;

  @SubscribeMessage('subscribeChats')
  async subscribeChats(client: Socket, { userId }: { userId: string }) {
    client.join(`chats-${userId}`);
  }

  @SubscribeMessage('subscribeChat')
  async subscribeChat(
    client: Socket,
    { chatId, userId }: { chatId: string; userId: string },
  ) {
    client.join(`chat-${userId}-${chatId}`);
  }
}
