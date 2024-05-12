import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import Queue, { Job, Queue as IQueue } from 'bull';
import { Logger } from '@nestjs/common';
import { FlowEventEntity } from '@/modules/product/entities/flow-event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';

interface IFlowEvent {
  id: string;
  product_id: string;
  events: Array<
    FlowEventEntity & {
      metadata: any;
    }
  >;
  phone: string;
  name: string;
  instanceId: string;
  created_at: Date;
}

@Processor('flow-event-queue')
export class FlowEventConsumer {
  private readonly logger = new Logger(FlowEventConsumer.name);

  constructor(
    @InjectQueue('flow-event-queue')
    private readonly reservaCotaQueue: IQueue<IFlowEvent>,
    private readonly configService: ConfigService,
    @InjectRepository(FlowEventEntity)
    private flowEventRepository: Repository<FlowEventEntity>,
    private readonly redisService: RedisService,
  ) {}

  @Process('data-event-process')
  async funnelEventProcess(job: Job<IFlowEvent>) {
    const data = job.data;

    const firstEvent = data.events[0];

    this.logger.log(`Dispach event: ${JSON.stringify(data, null, 2)}`);

    const queue = new Queue(`MessagesSender:${data.instanceId}`, {
      redis: this.configService.get<string>('REDIS_URL'),
    });

    const redis = this.redisService.getClient();

    const lastId = await redis.get(`flow:${data.phone}`);

    if (lastId && lastId !== data.id) {
      this.logger.log(`Event cancelled: ${lastId} - ${data.phone}`);
      return;
    }

    const restQueue = data.events.slice(1);

    switch (firstEvent.type) {
      case 'message': {
        await queue.add('sendMessage', {
          to: data.phone,
          content: firstEvent.metadata.message,
        });

        if (restQueue.length === 0) return;

        this.reservaCotaQueue.add('data-event-process', {
          ...data,
          events: restQueue,
          created_at: new Date(),
        });
        break;
      }
      case 'file': {
        await queue.add('sendFile', {
          to: data.phone,
          file: firstEvent.metadata.file,
          file_type: firstEvent.metadata.file_type,
        });

        if (restQueue.length === 0) return;

        this.reservaCotaQueue.add('data-event-process', {
          ...data,
          events: restQueue,
          created_at: new Date(),
        });
        break;
      }
      case 'delay': {
        const delay = firstEvent.metadata.delay;

        if (restQueue.length === 0) return;

        this.reservaCotaQueue.add(
          'data-event-process',
          {
            ...data,
            events: restQueue,
            created_at: new Date(),
          },
          {
            delay: delay * 1000,
          },
        );

        break;
      }
    }

    await this.flowEventRepository.query(
      `UPDATE "flow-event" SET times_sent = times_sent + 1 WHERE id = '${firstEvent.id}'`,
    );
  }
}
