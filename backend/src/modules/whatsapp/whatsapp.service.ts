import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Status, WhatsappEntity } from './entities/whatsapp.entity';
import Docker from 'dockerode';
import { ConfigService } from '@nestjs/config';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import crypto from 'crypto';
import BluePromise from 'bluebird';

const docker = new Docker();

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectRepository(WhatsappEntity)
    protected readonly repository: Repository<WhatsappEntity>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async onModuleInit() {
    const whatsapps = await this.repository.find({
      where: { status: Status.CONNECTED },
    });
    const containers = await docker.listContainers();
    const containersToStart = containers.filter(
      (container) =>
        container.State !== 'running' &&
        whatsapps.some((whatsapp) =>
          container.Names.includes(`/zapdiviser-node-${whatsapp.id}`),
        ),
    );
    await BluePromise.map(
      containersToStart,
      (container) => docker.getContainer(container.Id).start(),
      { concurrency: 10 },
    );
  }

  async onModuleDestroy() {
    if (this.configService.get('NODE_ENV') !== 'production') {
      const containers = await docker.listContainers();
      const containersToStop = containers.filter(
        (container) =>
          container.Names.some((name) => name.startsWith('/zapdiviser-node')) &&
          container.State === 'running',
      );
      await BluePromise.map(
        containersToStop,
        (container) => docker.getContainer(container.Id).stop(),
        { concurrency: 10 },
      );
    }
  }

  async findAll(user_id: string) {
    return await this.repository.find({
      where: {
        user_id,
      },
    });
  }

  async setWhatsappPhone(id: string, phone: string | null) {
    const whatsapp = await this.repository.findOne({
      where: { id },
    });

    if (!whatsapp) return null;

    whatsapp.phone = phone;
    whatsapp.status = phone !== null ? Status.CONNECTED : Status.PENDING;

    return await this.repository.save(whatsapp);
  }

  async isAvailable(id: string) {
    const whatsapp = await this.repository.findOne({
      where: { id },
    });

    return whatsapp?.status === Status.CONNECTED;
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

    const container = await docker.createContainer({
      Image: 'whatsapp',
      name: `zapdiviser-node-${id}`,
      HostConfig: {
        NetworkMode:
          this.configService.get('NODE_ENV') !== 'production'
            ? 'default'
            : 'zapdiviser',
      },
      Env: [
        `INSTANCE_ID=${id}`,
        `REDIS_URL=${this.configService.get('REDIS_URL')}`,
        `MINIO_ACCESS_KEY=${this.configService.get('MINIO_ACCESS_KEY')}`,
        `MINIO_SECRET_KEY=${this.configService.get('MINIO_SECRET_KEY')}`,
      ],
    });

    await container.start();

    return whatsapp;
  }

  async updateAll() {
    const whatsapps = await this.repository.find({
      where: { status: Status.CONNECTED },
    });

    await BluePromise.map(
      whatsapps,
      async (whatsapp) => {
        const container = await docker.getContainer(
          `zapdiviser-node-${whatsapp.id}`,
        );

        await container.rename({
          name: `zapdiviser-node-${whatsapp.id}-old`,
        });
      },
      { concurrency: 10 },
    );

    await BluePromise.map(
      whatsapps,
      async (whatsapp) => {
        const container = await docker.createContainer({
          Image: 'whatsapp',
          name: `zapdiviser-node-${whatsapp.id}`,
          HostConfig: {
            NetworkMode:
              this.configService.get('NODE_ENV') !== 'production'
                ? 'default'
                : 'zapdiviser',
          },
          Env: [
            `INSTANCE_ID=${whatsapp.id}`,
            `REDIS_URL=${this.configService.get('REDIS_URL')}`,
            `MINIO_ACCESS_KEY=${this.configService.get('MINIO_ACCESS_KEY')}`,
            `MINIO_SECRET_KEY=${this.configService.get('MINIO_SECRET_KEY')}`,
          ],
        });

        await container.start();
      },
      { concurrency: 10 },
    );
  }

  async stopOldWhatsapp(instanceId: string) {
    const container = docker.getContainer(`zapdiviser-node-${instanceId}-old`);

    await container.stop();
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

  setStatus(id: string, status: Status) {
    return this.repository.update(id, {
      status,
    });
  }

  async getInstance(instanceId: string) {
    return await this.repository.findOneOrFail({
      where: { id: instanceId },
      relations: { user: true },
    });
  }

  async remove(id: string, user_id: string) {
    const whatsapp = await this.repository.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!whatsapp) throw new HttpException('Whatsapp não encontrado', 404);

    const containers = await docker.listContainers();
    const containerId = containers.find((container) =>
      container.Names.includes(`/zapdiviser-node-${id}`),
    )?.Id;
    if (containerId) {
      const container = docker.getContainer(containerId);
      await container.stop();
    }

    whatsapp.products = [];
    await whatsapp.save();

    await this.repository.delete({
      id: whatsapp.id,
    });

    return whatsapp;
  }

  async webhook(payload: any, signature: string) {
    if (!this.verifySignature(payload, signature)) {
      throw new HttpException('Invalid signature', 401);
    }

    const data = JSON.parse(payload);

    if (data.action === 'created') {
      const whatsapp = await this.repository.findOne({
        where: {
          phone: data.issue.title,
        },
      });

      if (whatsapp) {
        await this.repository.update(whatsapp.id, {
          status: Status.CONNECTED,
        });
      }
    }
  }

  private verifySignature(payload: string, signatureHeader: string): boolean {
    const secret = this.configService.get('GITHUB_WEBHOOK_SECRET');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);

    const expectedSignature = `sha256=${hmac.digest('hex')}`;
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signatureHeader),
    );
  }
}
