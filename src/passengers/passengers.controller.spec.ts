import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { AuthGuard } from '../auth/auth.guard';

describe('PassengersController', () => {
  let controller: PassengersController;

  const mockAuthGuard = {};

  const mockPassengersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [PassengersService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(PassengersService)
      .useValue(mockPassengersService)
      .compile();

    controller = module.get<PassengersController>(PassengersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
