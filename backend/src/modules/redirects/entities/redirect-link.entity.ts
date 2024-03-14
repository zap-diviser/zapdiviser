import DefaultEntity from '@/common/defaults/entities/base.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { RedirectEntity } from './redirect.entity';

@Entity('redirectLink')
export class RedirectLinkEntity extends DefaultEntity {
  @Column()
  link: string;

  @ManyToOne(() => RedirectEntity, (redirect) => redirect.links, {
    onDelete: 'CASCADE',
  })
  redirect: Relation<RedirectEntity>;
}
