import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateDriverDto } from './dto/create-driver.dto';

describe('DriversController', () => {
  let driversController: DriversController;

  const mockDriversService = {
    create: jest.fn((createDriverDto: CreateDriverDto) =>
      Promise.resolve({ ...createDriverDto }),
    ),
  };

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

    driversController = module.get<DriversController>(DriversController);
  });

  it('should be defined', () => {
    expect(driversController).toBeDefined();
  });

  it('should create a new driver', async () => {
    const newDriver: CreateDriverDto = {
      name: 'John Doe',
      phone: '+254700000001',
    };
    expect(await driversController.create(newDriver)).toEqual({ ...newDriver });
  });
});
