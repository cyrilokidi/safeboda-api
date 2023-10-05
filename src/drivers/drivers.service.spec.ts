import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from './drivers.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../../src/config/db.config';
import { CreateDriverDto } from './dto/create-driver.dto';
import { faker } from '@faker-js/faker';

describe('DriversService', () => {
  let driversService: DriversService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
      ],
      providers: [DriversService],
    }).compile();

    driversService = moduleRef.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(driversService).toBeDefined();
  });

  it('should return new driver details', async () => {
    const createDriverDto: CreateDriverDto = {
      name: faker.person.fullName(),
      phone: '+25610000001',
    };
    const response = await driversService.create(createDriverDto);
    expect(response).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      suspended: false,
      ...createDriverDto,
    });
  });

  describe('Suspend driver', () => {
    let driverId: string;

    beforeEach(async () => {
      const createDriverDto: CreateDriverDto = {
        name: faker.person.fullName(),
        phone: '+25610000002',
      };
      const response = await driversService.create(createDriverDto);
      driverId = response.id;
    });

    it('should suspend driver', async () => {
      const response = await driversService.suspend(driverId);
      expect(response).toBe(undefined);
    });
  });
});
