import DefaultEntity from '@/common/defaults/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'logs' })
export class LogEntity extends DefaultEntity {
  @Column({ name: 'record_id', type: 'integer', nullable: false })
  public recordId: number;

  @Column({ name: 'record_title', type: 'text', nullable: true, default: '' })
  public recordTitle: string | null;

  @Column({ name: 'difference', type: 'jsonb', nullable: true, default: {} })
  public difference: Record<string, unknown> | null;

  @Column({ name: 'action', type: 'varchar', length: 128, nullable: false })
  public action: string;

  @Column({ name: 'resource', type: 'varchar', length: 128, nullable: false })
  public resource: string;

  @Column({ name: 'user_id', type: 'varchar', nullable: false })
  public userId: string;
}
