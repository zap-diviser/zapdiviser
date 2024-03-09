import { Test, TestingModule } from '@nestjs/testing';
import { RedirectsService } from './redirects.service';

describe('RedirectsService', () => {
  let service: RedirectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedirectsService],
    }).compile();

    service = module.get<RedirectsService>(RedirectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
