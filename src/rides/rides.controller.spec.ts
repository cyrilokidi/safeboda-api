import { Test, TestingModule } from '@nestjs/testing';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { AuthGuard } from '../auth/auth.guard';
import { RidesPageOptionsDto } from './dto/rides-page-options.dto';

describe('RidesController', () => {
  let ridesController: RidesController;

  const mockAuthGuard = {};

  const mockRidesService = {
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

  it('should find all ongoing rides', async () => {
    const ridesPageOptionsDto: RidesPageOptionsDto = { skip: 0 };
    expect(await ridesController.findAll(ridesPageOptionsDto)).toEqual({
      ...ridesPageOptionsDto,
    });
  });
});
