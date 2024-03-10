import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { WhatsappEntity } from './entities/whatsapp.entity';
import Docker from 'dockerode';
import { ConfigService } from '@nestjs/config';

const docker = new Docker();

@Injectable()
export class WhatsappService {
  constructor(
    @InjectRepository(WhatsappEntity)
    protected readonly repository: Repository<WhatsappEntity>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(user_id: string) {
    return await this.repository.find({
      where: {
        user_id,
      },
    });
  }

  async setWhatsappPhone(id: string, phone: string) {
    const whatsapp = await this.repository.findOne({
      where: { id },
    });

    if (!whatsapp) return null;

    whatsapp.phone = phone;
    whatsapp.status = 1;

    return await this.repository.save(whatsapp);
  }

  async getByUserId(userId: string) {
    return this.repository.find({
      where: {
        user_id: userId,
      },
    });
  }

  async create(userId: string): Promise<WhatsappEntity> {
    const whatsapp = await this.repository.save({
      user_id: userId,
    });

    const id = whatsapp.id;

    await docker.createContainer({
      Image: 'registry:5000/whatsapp',
      name: `zapdiviser-node-${id}`,
      Env: [
        `INSTANCE_ID=${id}`,
        `REDIS_URL=${this.configService.get('REDIS_URL')}`,
      ],
    });

    return whatsapp;
  }

  async updateCode() {
    const redis = this.redisService.getClient();
    await redis.del('whatsapp-node-code');
  }

  async findOne(id: string, user_id: string) {
    return this.repository.findOne({
      where: {
        id,
        user_id,
      },
    });
  }

  update(id: string) {
    return this.repository.update(id, {});
  }

  async remove(id: string, user_id: string) {
    const whatsapp = await this.repository.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!whatsapp) throw new HttpException('Whatsapp não encontrado', 404);

    const containers = await docker.listContainers({
      filters: `name=zapdiviser-node-${whatsapp.id}`,
    });
    const container = docker.getContainer(containers[0].Id);
    await container.stop();

    await this.repository.delete({
      id: whatsapp.id,
    });

    return whatsapp;
  }
}
