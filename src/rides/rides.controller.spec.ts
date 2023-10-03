import { Test, TestingModule } from '@nestjs/testing';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { AuthGuard } from '../auth/auth.guard';

describe('RidesController', () => {
  let controller: RidesController;

  const mockAuthGuard = {};

  const mockRidesService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RidesController],
      providers: [RidesService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(RidesService)
      .useValue(mockRidesService)
      .compile();

    controller = module.get<RidesController>(RidesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
