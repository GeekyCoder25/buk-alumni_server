import { Test, TestingModule } from '@nestjs/testing';
import { GraduatesService } from './graduates.service';

describe('GraduatesService', () => {
  let service: GraduatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraduatesService],
    }).compile();

    service = module.get<GraduatesService>(GraduatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
