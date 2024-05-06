import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { UpdateRedirectDto } from './dto/update-redirect.dto';
import { CreateRedirectLinkDto } from './dto/create-redirect-link.dto';
import { UpdateRedirectLinkDto } from './dto/update-redirect-link.dto';
import { Repository } from 'typeorm';
import { RedirectEntity } from './entities/redirect.entity';
import { RedirectLinkEntity } from './entities/redirect-link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedirectsService {
  constructor(
    @InjectRepository(RedirectEntity)
    protected readonly redirectRepository: Repository<RedirectEntity>,
    @InjectRepository(RedirectLinkEntity)
    protected readonly redirectLinkRepository: Repository<RedirectLinkEntity>,
    private readonly redisService: RedisService,
  ) {}

  async redirect(slug: string) {
    const redis = this.redisService.getClient();
    const result = await redis
      .multi()
      .get(`redirect:${slug}:index`)
      .lrange(`redirect:${slug}:links`, 0, -1)
      .exec();

    if (result === null) {
      throw new NotFoundException();
    }

    // eslint-disable-next-line prefer-const
    let [[, index], [, links]] = result as unknown as [
      [any, number],
      [any, string[]],
    ];

    index = index ?? 0;

    const currentUrl = links[index];

    let nextIndex = index - 1;

    if (nextIndex < 0) {
      nextIndex = links.length - 1;
    }

    redis.set(`redirect:${slug}:index`, nextIndex);

    return currentUrl;
  }

  async create(createRedirectDto: CreateRedirectDto, userId: string) {
    const links = createRedirectDto.links.map((link) => ({
      link: link.link,
    }));

    const [redirect] = await Promise.all([
      this.redirectRepository.save({
        slug: createRedirectDto.slug,
        name: createRedirectDto.name,
        user: {
          id: userId,
        },
        links,
      }),
      this.redisService
        .getClient()
        .lpush(
          `redirect:${createRedirectDto.slug}:links`,
          ...links.map((link) => link.link),
        ),
    ]);

    return {
      ...redirect,
      links,
    };
  }

  async slugAvailable(slug: string) {
    const redirect = await this.redirectRepository.findOne({
      where: {
        slug,
      },
    });

    return !redirect;
  }

  async createRedirectLink(
    redirectId: string,
    createRedirectLinkDto: CreateRedirectLinkDto,
    userId: string,
  ) {
    const redirect = await this.redirectRepository.findOne({
      where: {
        id: redirectId,
        user: {
          id: userId,
        },
      },
    });

    if (!redirect) {
      throw new NotFoundException();
    }

    const link = createRedirectLinkDto.link;

    return Promise.all([
      this.redirectLinkRepository
        .create({
          redirect: redirect,
          link: link,
        })
        .save(),
      this.redisService
        .getClient()
        .lpush(`redirect:${redirect.slug}:links`, link),
    ]);
  }

  findAll(userId: string) {
    return this.redirectRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['links'],
    });
  }

  findOne(id: string, userId: string) {
    return this.redirectRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
      relations: ['links'],
    });
  }

  getLink(id: string, userId: string) {
    return this.redirectLinkRepository.findOne({
      where: {
        id,
        redirect: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['redirect'],
    });
  }

  async update(
    id: string,
    updateRedirectDto: UpdateRedirectDto,
    userId: string,
  ) {
    if (updateRedirectDto.slug) {
      const redirect = await this.redirectRepository.findOne({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });

      if (!redirect) {
        throw new NotFoundException();
      }

      const redis = this.redisService.getClient();

      redis.rename(
        `redirect:${redirect.slug}:index`,
        `redirect:${updateRedirectDto.slug}:index`,
      );
      redis.rename(
        `redirect:${redirect.slug}:links`,
        `redirect:${updateRedirectDto.slug}:links`,
      );
    }

    //update but returning new data
    return this.redirectRepository.save({
      id,
      ...updateRedirectDto,
      user: {
        id: userId,
      },
    });
  }

  async updateRedirectLink(
    redirectId: string,
    linkId: string,
    updateRedirectLinkDto: UpdateRedirectLinkDto,
    userId: string,
  ) {
    const redis = this.redisService.getClient();

    if (updateRedirectLinkDto.link) {
      const redirect = await this.redirectRepository.findOne({
        where: {
          id: redirectId,
          user: {
            id: userId,
          },
        },
      });

      if (!redirect) {
        throw new NotFoundException();
      }

      const linkIndex = await redis.lindex(
        `redirect:${redirect.slug}:links`,
        0,
      );

      if (!linkIndex) {
        throw new NotFoundException();
      }

      return Promise.all([
        this.redirectLinkRepository.update(
          {
            id: linkId,
            redirect: {
              id: redirectId,
              user: {
                id: userId,
              },
            },
          },
          updateRedirectLinkDto,
        ),
        redis.lset(
          `redirect:${redirect.slug}:links`,
          linkIndex,
          new URL(updateRedirectLinkDto.link).toString(),
        ),
      ]);
    }
  }

  async remove(id: string, userId: string) {
    const redirect = await this.redirectRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!redirect) {
      throw new NotFoundException();
    }

    return Promise.all([
      this.redirectRepository.delete({
        id,
        user: {
          id: userId,
        },
      }),
      this.redisService
        .getClient()
        .multi()
        .del(`redirect:${redirect.slug}:index`)
        .del(`redirect:${redirect.slug}:links`)
        .exec(),
    ]);
  }

  async removeRedirectLink(linkId: string, userId: string) {
    const linkEntity = await this.getLink(linkId, userId);

    if (!linkEntity) {
      throw new NotFoundException();
    }

    return Promise.all([
      linkEntity,
      this.redirectLinkRepository.delete({
        id: linkEntity.id,
      }),
      this.redisService
        .getClient()
        .multi()
        .lrem(`redirect:${linkEntity.redirect.slug}:links`, 0, linkEntity.link)
        .set(`redirect:${linkEntity.redirect.slug}:index`, 0)
        .exec(),
    ]);
  }
}
