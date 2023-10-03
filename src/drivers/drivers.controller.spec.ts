import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { AuthGuard } from '../auth/auth.guard';

describe('DriversController', () => {
  let controller: DriversController;

  const mockDriversService = {};

  const mockAuthGuard = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [DriversService],
    })
      .overrideProvider(DriversService)
      .useValue(mockDriversService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<DriversController>(DriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
