import { Test, TestingModule } from '@nestjs/testing';
import { RidesService } from './rides.service';
import { DataSource } from 'typeorm';

describe('RidesService', () => {
  let service: RidesService;

  const mockDataSource = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RidesService, DataSource],
    })
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .compile();

    service = module.get<RidesService>(RidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
