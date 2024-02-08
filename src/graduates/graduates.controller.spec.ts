import { Test, TestingModule } from '@nestjs/testing';
import { GraduatesController } from './graduates.controller';

describe('GraduatesController', () => {
  let controller: GraduatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraduatesController],
    }).compile();

    controller = module.get<GraduatesController>(GraduatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
