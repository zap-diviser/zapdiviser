import DefaultEntity from '@/common/defaults/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ProductFlowEntity } from './product-flow.entity';

@Entity('flow-event')
export class FlowEventEntity extends DefaultEntity {
  @ManyToOne(() => ProductFlowEntity, (product) => product.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_flow_id' })
  product_flow: Relation<ProductFlowEntity>;

  @Column()
  product_flow_id: string;

  @Column()
  type: string;

  @Column()
  sort: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    text?: string;
  };

  //create column times_sent
  @Column({ default: 0 })
  times_sent: number;
}
