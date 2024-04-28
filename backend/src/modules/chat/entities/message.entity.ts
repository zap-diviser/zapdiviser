import DefaultEntity from '@/common/defaults/entities/base.entity';
import { ProductEntity } from '@/modules/product/entities/product.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Entity('Message')
export class MessageEntity extends DefaultEntity {
  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  chat: Relation<ProductEntity>;

  @Column({
    type: 'jsonb',
  })
  content: any;

  fromMe: boolean;
}
