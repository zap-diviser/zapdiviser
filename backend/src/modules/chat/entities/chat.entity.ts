import DefaultEntity from '@/common/defaults/entities/base.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { WhatsappEntity } from '../../whatsapp/entities/whatsapp.entity';
import { MessageEntity } from './message.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

@Entity('Chat')
export class ChatEntity extends DefaultEntity {
  @Column({ type: String, nullable: true })
  phone: string | null;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  user: Relation<ChatEntity>;

  @ManyToOne(() => WhatsappEntity, (whatsapp) => whatsapp.chats)
  currentWhatsapp: Relation<WhatsappEntity>;

  @ManyToOne(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];
}