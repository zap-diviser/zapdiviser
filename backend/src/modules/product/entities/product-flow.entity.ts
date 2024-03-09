import DefaultEntity from '@/common/defaults/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
  Unique,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { FlowEventEntity } from './flow-event.entity';

@Entity('product-flow')
@Unique(['product_id', 'name'])
export class ProductFlowEntity extends DefaultEntity {
  @ManyToOne(() => ProductEntity, (product) => product.flows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductEntity>;

  @Column()
  product_id: string;

  @Column()
  name: string;

  @OneToMany(() => FlowEventEntity, (item) => item.product_flow)
  events: FlowEventEntity[];
}
