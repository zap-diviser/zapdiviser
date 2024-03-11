import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateFlowEventDto } from './dto/create-flow-event.dto';
import { FlowEventEntity } from './entities/flow-event.entity';
import { ProductFlowEntity } from './entities/product-flow.entity';
import { ProductEntity } from './entities/product.entity';
import { UpdateFlowEventDto } from './dto/update-flow-event.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { handle } from './handlers';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { EventsHistoryEntity } from './entities/events-history.entity';
import { InjectMinio } from 'nestjs-minio';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(EventsHistoryEntity)
    private eventsHistoryRepository: Repository<EventsHistoryEntity>,
    @InjectRepository(FlowEventEntity)
    private flowEventRepository: Repository<FlowEventEntity>,
    @InjectRepository(ProductFlowEntity)
    private productFlowRepository: Repository<ProductFlowEntity>,
    @InjectQueue('flow-event-queue')
    private readonly flowEventQueue: Queue,
    private readonly whatsappService: WhatsappService,
    @InjectMinio() private readonly minioClient: Client,
    private readonly config: ConfigService,
  ) {}

  async webhook(product_id: string, body: any) {
    const data = handle(body);

    if (!data) throw new HttpException('Evento não encontrado', 404);

    const productFlowEvents = await this.productFlowRepository.findOne({
      where: {
        product_id,
        name: data?.event,
      },
      relations: ['events'],
      order: {
        events: {
          sort: 'ASC',
        },
      },
    });

    if (!productFlowEvents)
      throw new HttpException('Evento não encontrado para este produto', 404);

    const whatsapps = await this.findProductWhatsapps(product_id);

    if (whatsapps.length === 0)
      throw new HttpException(
        'Nenhum whatsapp cadastrado para este produto',
        404,
      );

    const instanceId =
      whatsapps[Math.floor(Math.random() * whatsapps.length)].instanceId;

    const lastInstanceOccurrence = await this.eventsHistoryRepository.findOne({
      where: {
        product_id,
        to: data.phone,
      },
      order: {
        created_at: 'DESC',
      },
    });

    const flowData = {
      product_id,
      instanceId: lastInstanceOccurrence?.instanceId || instanceId,
      events: productFlowEvents.events,
      phone: data.phone,
      name: data.name,
      created_at: new Date(),
    };

    this.flowEventQueue.add('data-event-process', flowData);

    if (!lastInstanceOccurrence?.instanceId) {
      await this.eventsHistoryRepository.save({
        product_id,
        instanceId: flowData.instanceId,
        to: data.phone,
      });
    }

    return {
      message: 'Evento enviado para a fila',
    };
  }

  async removeWhatsappFromProduct(
    productId: string,
    userId: string,
    whatsappId: string,
  ) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        user_id: userId,
      },
      relations: ['whatsapps'],
    });

    if (!product) throw new HttpException('Produto não encontrado', 404);

    product.whatsapps = product.whatsapps.filter(
      (whatsapp) => whatsapp.id !== whatsappId,
    );

    return product.save();
  }

  async setWhatsapps(productId: string, userId: string, whatsappId: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        user_id: userId,
      },
      relations: {
        whatsapps: true,
        flows: {
          events: true,
        },
      },
    });

    if (!product) throw new HttpException('Produto não encontrado', 404);

    const whatsapp = await this.whatsappService.findOne(whatsappId, userId);

    if (!whatsapp) throw new HttpException('Whatsapp não encontrado', 404);

    product.whatsapps.push(whatsapp);

    return product.save();
  }

  async createFlowEvent(body: CreateFlowEventDto, user_id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: body.product_id,
        user_id,
      },
      relations: {
        flows: {
          events: true,
        },
      },
    });

    if (!product) throw new HttpException('Produto não encontrado', 404);

    let flow = product.flows.find((flow) => flow.name === body.flow_name);

    if (!flow) {
      flow = await this.productFlowRepository.save({
        product_id: body.product_id,
        name: body.flow_name,
      });
      flow.events = [];
    }

    if (flow.events.length > 0) {
      await this.flowEventRepository
        .createQueryBuilder('flow_event')
        .update(FlowEventEntity)
        .set({ sort: () => 'sort + 1' })
        .where('product_flow_id = :product_flow_id', {
          product_flow_id: flow.id,
        })
        .andWhere('sort >= :sort', { sort: body.sort })
        .execute();
    }

    await this.flowEventRepository.save({
      product_flow_id: flow.id,
      sort: body.sort,
      type: body.type,
      metadata: body.metadata as FlowEventEntity['metadata'],
    });

    const newflow = await this.productFlowRepository.findOne({
      where: {
        id: flow.id,
      },
      relations: ['events'],
      order: {
        events: {
          sort: 'ASC',
        },
      },
    });

    return newflow;
  }

  async updateFlowEvent(id: string, body: UpdateFlowEventDto, user_id: string) {
    const event = await this.flowEventRepository.findOne({
      where: {
        id,
        product_flow: {
          product: {
            user_id,
          },
        },
      },
    });

    if (!event) throw new HttpException('Evento não encontrado', 404);

    await this.flowEventRepository.update(
      {
        id: event.id,
      },
      {
        metadata: body.metadata as FlowEventEntity['metadata'],
        type: body.type,
      },
    );

    return this.flowEventRepository.findOne({
      where: {
        id: event.id,
      },
    });
  }

  async deleteFlowEvent(id: string, user_id: string) {
    const event = await this.flowEventRepository.findOne({
      where: {
        id,
        product_flow: {
          product: {
            user_id,
          },
        },
      },
    });

    if (!event) throw new HttpException('Evento não encontrado', 404);

    await this.flowEventRepository.delete({
      id: event.id,
    });

    await this.flowEventRepository
      .createQueryBuilder('flow_event')
      .update(FlowEventEntity)
      .set({ sort: () => 'sort - 1' })
      .where('product_flow_id = :product_flow_id', {
        product_flow_id: event.product_flow_id,
      })
      .andWhere('sort > :sort', { sort: event.sort })
      .execute();

    return event;
  }

  createProduct(body: CreateProductDto, user_id: string) {
    const product = this.productRepository.create({ ...body, user_id });
    return this.productRepository.save(product);
  }

  async findAllProducts(user_id: string) {
    return await this.productRepository.find({ where: { user_id } });
  }

  async findProduct(id: string, user_id: string) {
    const item = await this.productRepository.findOne({
      where: {
        id,
        user_id,
      },
      relations: {
        flows: {
          events: true,
        },
        whatsapps: true,
      },
    });

    if (!item) throw new HttpException('Produto não encontrado', 404);

    return item;
  }

  async findProductWhatsapps(product_id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: product_id,
      },
      relations: ['whatsapps'],
    });

    if (!product) throw new HttpException('Produto não encontrado', 404);

    return product.whatsapps.filter((whatsapp) => whatsapp.status === 1);
  }

  async updateProduct(id: string, body: CreateProductDto, user_id: string) {
    const item = await this.productRepository.findOneBy({ id, user_id });

    if (!item) throw new HttpException('Produto não encontrado', 404);

    await this.productRepository.update(
      {
        id: item.id,
      },
      body,
    );

    return this.productRepository.findOneBy({ id: item.id });
  }

  async deleteProduct(id: string, user_id: string) {
    const item = await this.productRepository.findOneBy({ id, user_id });

    if (!item) throw new HttpException('Produto não encontrado', 404);

    await this.productRepository.delete({
      id: item.id,
    });

    return item;
  }

  async createMediaPressignedUrl(product_id: string, user_id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: product_id,
        user_id,
      },
    });

    const id = `${user_id}/${product_id}/${new Date().getTime()}`;

    if (!product) throw new HttpException('Produto não encontrado', 404);

    const upload_url = await this.minioClient.presignedPutObject(
      this.config.get<string>('MINIO_BUCKET')!,
      id,
      60 * 60,
    );

    return {
      upload_url,
      id,
    };
  }
}
