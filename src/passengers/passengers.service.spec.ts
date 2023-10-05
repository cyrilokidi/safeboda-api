import { Test, TestingModule } from '@nestjs/testing';
import { PassengersService } from './passengers.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../../src/config/db.config';
import { faker } from '@faker-js/faker';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Driver } from '../../src/drivers/entities/driver.entity';
import { Passenger } from './entities/passenger.entity';
import { Ride } from '../../src/rides/entities/ride.entity';
import { DataSource } from 'typeorm';

describe('PassengersService', () => {
  let passengersService: PassengersService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
        TypeOrmModule.forFeature([Driver, Passenger, Ride]),
      ],
      providers: [PassengersService],
    }).compile();

    passengersService = moduleRef.get<PassengersService>(PassengersService);
    dataSource = moduleRef.get<DataSource>(DataSource);

    await dataSource
      .createQueryBuilder(Passenger, 'passenger')
      .delete()
      .execute();
  });

  it('should be defined', () => {
    expect(passengersService).toBeDefined();
  });

  it('should return new passenger details', async () => {
    const createPassengerDto: CreatePassengerDto = {
      name: faker.person.fullName(),
      phone: '+25510000001',
    };
    const response = await passengersService.create(createPassengerDto);
    expect(response).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      ...createPassengerDto,
    });
  });
});
