import DefaultEntity from '@/common/defaults/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { RedirectLinkEntity } from './redirect-link.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

@Entity('redirect')
export class RedirectEntity extends DefaultEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => RedirectLinkEntity, (link) => link.redirect, {})
  links: RedirectLinkEntity[];

  @ManyToOne(() => UserEntity, (user) => user.redirects)
  user: Relation<UserEntity>;
}
