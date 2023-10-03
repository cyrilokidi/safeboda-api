import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateDriverDto } from './dto/create-driver.dto';

describe('DriversController', () => {
  let controller: DriversController;

  const mockDriversService = {
    create: jest.fn((createDriverDto: CreateDriverDto) => createDriverDto),
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

    controller = module.get<DriversController>(DriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new driver', () => {
    const newDriver: CreateDriverDto = {
      name: 'John Doe',
      phone: '+254700000001',
    };
    expect(controller.create(newDriver)).toEqual(newDriver);
  });
});
