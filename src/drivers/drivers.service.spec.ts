import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from './drivers.service';
import { DataSource } from 'typeorm';

describe('DriversService', () => {
  let service: DriversService;

  const mockDataSource = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversService, DataSource],
    })
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .compile();

    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
