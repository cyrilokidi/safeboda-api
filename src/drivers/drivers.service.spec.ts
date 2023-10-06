import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from './drivers.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../../src/config/db.config';
import { CreateDriverDto } from './dto/create-driver.dto';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { Passenger } from '../../src/passengers/entities/passenger.entity';
import { Ride } from '../../src/rides/entities/ride.entity';

describe('DriversService', () => {
  let driversService: DriversService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
        TypeOrmModule.forFeature([Driver, Passenger, Ride]),
      ],
      providers: [DriversService],
    }).compile();

    driversService = moduleRef.get<DriversService>(DriversService);
    dataSource = moduleRef.get<DataSource>(DataSource);

    await dataSource.createQueryBuilder(Driver, 'driver').delete().execute();
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

  describe('Delete suspend driver', () => {
    let driverId: string;

    beforeEach(async () => {
      const createDriverDto: CreateDriverDto = {
        name: faker.person.fullName(),
        phone: '+25610000003',
      };
      const response = await driversService.create(createDriverDto);
      driverId = response.id;
    });

    it('should suspend driver', async () => {
      const response = await driversService.deleteSuspend(driverId);
      expect(response).toBe(undefined);
    });
  });
});
