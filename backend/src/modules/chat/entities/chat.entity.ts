import DefaultEntity from '@/common/defaults/entities/base.entity';
import { ProductEntity } from '@/modules/product/entities/product.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { WhatsappEntity } from '../../whatsapp/entities/whatsapp.entity';
import { MessageEntity } from './message.entity';

@Entity('Chat')
export class ChatEntity extends DefaultEntity {
  @Column({ type: String, nullable: true })
  phone: string | null;

  @ManyToOne(() => ProductEntity, (product) => product.chats)
  product: Relation<ProductEntity>;

  @ManyToOne(() => WhatsappEntity, (whatsapp) => whatsapp.chats)
  currentWhatsapp: Relation<WhatsappEntity>;

  @ManyToOne(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];
}
