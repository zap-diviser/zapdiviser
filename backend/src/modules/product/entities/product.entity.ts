import DefaultEntity from '@/common/defaults/entities/base.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { ProductFlowEntity } from './product-flow.entity';
import { WhatsappEntity } from '@/modules/whatsapp/entities/whatsapp.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EventsHistoryEntity } from './events-history.entity';
import { ChatEntity } from '@/modules/chat/entities/chat.entity';

@Entity('product')
export class ProductEntity extends DefaultEntity {
  @ManyToOne(() => UserEntity, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @OneToMany(() => ProductFlowEntity, (item) => item.product, { cascade: true })
  flows: ProductFlowEntity[];

  @ApiProperty({ type: () => [WhatsappEntity] })
  @ManyToMany(() => WhatsappEntity, (item) => item.products, { cascade: true })
  @JoinTable()
  whatsapps: WhatsappEntity[];

  @OneToMany(() => EventsHistoryEntity, (item) => item.product)
  eventsHistory: EventsHistoryEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.product)
  chats: ChatEntity[];
}
