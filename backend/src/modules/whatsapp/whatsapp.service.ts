import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Interval } from '@nestjs/schedule';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { readFile } from 'fs/promises';
import { WhatsappEntity } from './entities/whatsapp.entity';
import simpleGit, { CleanOptions, SimpleGit } from 'simple-git';
import { createId } from '@paralleldrive/cuid2';

const git: SimpleGit = simpleGit({
  binary: 'git',
}).clean(CleanOptions.FORCE);

@Injectable()
export class WhatsappService implements OnModuleInit {
  constructor(
    @InjectRepository(WhatsappEntity)
    protected readonly repository: Repository<WhatsappEntity>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(user_id: string) {
    return await this.repository.find({
      where: {
        user_id,
      },
    });
  }

  @Interval(1000 * 60 * 60 * 24)
  async login() {
    const res = await fetch(`${process.env.CAPROVER_URL}/api/v2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Namespace': 'captain',
      },
      body: JSON.stringify({
        otpToken: '',
        password: process.env.CAPROVER_PASSWORD,
      }),
    });

    const {
      data: { token },
    } = await res.json();

    await this.redisService.getClient().set('caprover-token', token);
  }

  onModuleInit() {
    this.login();
  }

  async setWhatsappPhone(id: string, phone: string) {
    const whatsapp = await this.repository.findOne({
      where: {
        instanceId: id,
      },
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
    const redis = this.redisService.getClient();
    const token = (await redis.get('caprover-token')) as string;

    const whatsapp = await this.repository.save({
      user_id: userId,
      instanceId: createId(),
    });

    const id = whatsapp.instanceId;

    (async () => {
      await fetch(
        `${process.env.CAPROVER_URL}/api/v2/user/apps/appDefinitions/register?detached=1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Captain-Auth': token,
            'X-Namespace': 'captain',
          },
          body: JSON.stringify({
            appName: `zapdivizer-instance-${id}`,
            hasPersistentData: false,
          }),
        },
      );

      console.log('deploying');

      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const res = await fetch(
          `${process.env.CAPROVER_URL}/api/v2/user/apps/appData/zapdivizer-instance-${id}?detached=1`,
          {
            headers: {
              'X-Captain-Auth': token,
              'X-Namespace': 'captain',
            },
          },
        );

        console.log('res', res);

        const {
          data: { isAppBuilding },
        } = await res.json();

        if (!isAppBuilding) {
          break;
        }
      }

      let buffer = await redis.getBuffer('whatsapp-node-code');

      if (!buffer) {
        await git.clone(process.env.GIT_REPO_URL!, `/tmp/${id}`);
        await git
          .cwd(`/tmp/${id}`)
          .raw([
            'archive',
            '--format=tar',
            'HEAD',
            '-o',
            `/tmp/${id}/node.tar`,
          ]);
        buffer = await readFile(`/tmp/${id}/node.tar`);

        await redis.set('whatsapp-node-code', buffer, 'EX', 60 * 60 * 24);
      }

      const file = new Blob([buffer], { type: 'application/x-tar' });
      const deployData = new FormData();
      deployData.append('sourceFile', file);

      console.log('deployData', deployData);

      await fetch(
        `${process.env.CAPROVER_URL}/api/v2/user/apps/appData/zapdivizer-instance-${id}?detached=1`,
        {
          method: 'POST',
          headers: {
            'X-Captain-Auth': token,
            'X-Namespace': 'captain',
          },
          body: deployData,
        },
      );

      const waitForBuild = async () => {
        return new Promise(async (resolve) => {
          while (true) {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const res = await fetch(
              `${process.env.CAPROVER_URL}/api/v2/user/apps/appData/zapdivizer-instance-${id}?detached=1`,
              {
                headers: {
                  'X-Captain-Auth': token,
                  'X-Namespace': 'captain',
                },
              },
            ).catch(() => null);

            if (!res) continue;

            const {
              data: { isAppBuilding },
            } = await res.json();

            if (!isAppBuilding) {
              resolve(null);
              break;
            }
          }
        });
      };

      const update = async () => {
        await fetch(
          `${process.env.CAPROVER_URL}/api/v2/user/apps/appDefinitions/update`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Captain-Auth': token,
              'X-Namespace': 'captain',
            },
            body: JSON.stringify({
              appName: `zapdivizer-instance-${id}`,
              instanceCount: 1,
              captainDefinitionRelativeFilePath: './captain-definition',
              notExposeAsWebApp: true,
              forceSsl: false,
              websocketSupport: false,
              volumes: [],
              ports: [],
              preDeployFunction: '',
              serviceUpdateOverride: '',
              containerHttpPort: 80,
              description: '',
              envVars: [
                { key: 'INSTANCE_ID', value: id },
                { key: 'REDIS_URL', value: process.env.REDIS_URL },
              ],
              appDeployTokenConfig: { enabled: false },
              tags: [],
              redirectDomain: '',
            }),
          },
        );
      };

      await waitForBuild();
      await update();

      console.log('deployed');
    })();

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
    const redis = this.redisService.getClient();
    const token = (await redis.get('caprover-token')) as string;

    const whatsapp = await this.repository.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!whatsapp) throw new HttpException('Whatsapp não encontrado', 404);

    await fetch(
      `${process.env.CAPROVER_URL}/api/v2/user/apps/appDefinitions/delete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Captain-Auth': token,
          'X-Namespace': 'captain',
        },
        body: JSON.stringify({
          appName: `zapdivizer-instance-${whatsapp.instanceId}`,
          volumes: [],
        }),
      },
    );

    await this.repository.delete({
      id: whatsapp.id,
    });

    return whatsapp;
  }
}
