import { Test, TestingModule } from '@nestjs/testing';
import { PassengersService } from './passengers.service';
import { DataSource } from 'typeorm';

describe('PassengersService', () => {
  let service: PassengersService;

  const mockDataSource = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassengersService, DataSource],
    })
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .compile();

    service = module.get<PassengersService>(PassengersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
