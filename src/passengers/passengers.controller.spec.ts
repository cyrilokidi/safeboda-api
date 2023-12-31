import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePassengerDto } from './dto/create-passenger.dto';

describe('PassengersController', () => {
  let passengersController: PassengersController;

  const mockAuthGuard = {};

  const mockPassengersService = {
    create: jest.fn((createPassengerDto: CreatePassengerDto) =>
      Promise.resolve({
        ...createPassengerDto,
      }),
    ),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [PassengersService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(PassengersService)
      .useValue(mockPassengersService)
      .compile();

    passengersController =
      moduleRef.get<PassengersController>(PassengersController);
  });

  it('should be defined', () => {
    expect(passengersController).toBeDefined();
  });

  it('should create a new passenger', async () => {
    const newPassenger: CreatePassengerDto = {
      name: 'John Doe',
      phone: '+254700000001',
    };
    expect(await passengersController.create(newPassenger)).toEqual({
      ...newPassenger,
    });
  });
});
