import DefaultEntity from '@/common/defaults/entities/base.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Entity('Message')
export class MessageEntity extends DefaultEntity {
  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  chat: Relation<ChatEntity>;

  @Column({
    type: 'jsonb',
  })
  content: any;

  @Column({ type: Boolean, default: false })
  fromMe: boolean;
}
