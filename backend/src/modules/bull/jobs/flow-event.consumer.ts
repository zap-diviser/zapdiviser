import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import Queue, { Job, Queue as IQueue } from 'bull';

interface IFlowEvent {
  product_id: string;
  events: { type: string; metadata: any }[];
  phone: string;
  name: string;
  instanceId: string;
  created_at: Date;
}

@Processor('flow-event-queue')
export class FlowEventConsumer {
  constructor(
    @InjectQueue('flow-event-queue')
    private readonly reservaCotaQueue: IQueue<IFlowEvent>,
    private readonly configService: ConfigService,
  ) {}

  @Process('data-event-process')
  async funnelEventProcess(job: Job<IFlowEvent>) {
    const data = job.data;

    const firstEvent = data.events[0];

    console.log(data.instanceId);

    const queue = new Queue(`MessagesSender:${data.instanceId}`, {
      redis: this.configService.get<string>('REDIS_URL'),
    });

    const restQueue = data.events.slice(1);

    switch (firstEvent.type) {
      case 'message': {
        console.log('enviando mensagem para ', data.phone);

        await queue.add('send-message', {
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
        await queue.add('send-file', {
          to: data.phone,
          file: firstEvent.metadata.file,
          type: firstEvent.metadata.file_type,
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
        console.log('delay de ', delay, 'segundos');

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
  }
}
