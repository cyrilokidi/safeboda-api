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
    suspend: jest.fn((driverId: string) => Promise.resolve(driverId)),
    deleteSuspend: jest.fn((driverId: string) => Promise.resolve(driverId)),
  };

  const mockAuthGuard = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [DriversService],
    })
      .overrideProvider(DriversService)
      .useValue(mockDriversService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    driversController = moduleRef.get<DriversController>(DriversController);
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

  it('should suspend a driver', async () => {
    const driverId = '1';
    expect(await driversController.suspend(driverId)).toEqual(driverId);
  });

  it('should delete suspend for a driver', async () => {
    const driverId = '1';
    expect(await driversController.deleteSuspend(driverId)).toEqual(driverId);
  });
});
