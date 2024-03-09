import DefaultEntity from '@/common/defaults/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('events-history')
export class EventsHistoryEntity extends DefaultEntity {
  @Column()
  instanceId: string;

  @Column()
  to: string;

  @ManyToOne(() => ProductEntity, (product) => product.eventsHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductEntity>;

  @Column()
  product_id: string;
}
