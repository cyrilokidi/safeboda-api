import { Test, TestingModule } from '@nestjs/testing';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { AuthGuard } from '../auth/auth.guard';
import { RidesPageOptionsDto } from './dto/rides-page-options.dto';
import { CreateRideDto } from './dto/create-ride.dto';

describe('RidesController', () => {
  let ridesController: RidesController;

  const mockAuthGuard = {};

  const mockRidesService = {
    create: jest.fn(
      (passengerId: string, driverId: string, createRideDto: CreateRideDto) =>
        Promise.resolve({
          passengerId,
          driverId,
          ...createRideDto,
        }),
    ),
    findAll: jest.fn((ridesPageOptionsDto: RidesPageOptionsDto) =>
      Promise.resolve({ ...ridesPageOptionsDto }),
    ),
  };

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

    ridesController = module.get<RidesController>(RidesController);
  });

  it('should be defined', () => {
    expect(ridesController).toBeDefined();
  });

  it('should create a new ride', async () => {
    const passengerId = '1';
    const driverId = '1';
    const createRideDto: CreateRideDto = {
      pickupPointLatitude: 1.2921,
      pickupPointLongitude: 36.8219,
      destinationLatitude: 1.2921,
      destinationLongitude: 36.8219,
    };
    expect(
      await ridesController.create(passengerId, driverId, createRideDto),
    ).toEqual({
      passengerId,
      driverId,
      ...createRideDto,
    });
  });

  it('should find all ongoing rides', async () => {
    const ridesPageOptionsDto: RidesPageOptionsDto = { skip: 0 };
    expect(await ridesController.findAll(ridesPageOptionsDto)).toEqual({
      ...ridesPageOptionsDto,
    });
  });
});
