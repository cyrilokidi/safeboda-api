import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { AuthGuard } from '../auth/auth.guard';

describe('PassengersController', () => {
  let passengersController: PassengersController;

  const mockAuthGuard = {};

  const mockPassengersService = {};

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
});
