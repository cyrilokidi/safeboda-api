import { Test, TestingModule } from '@nestjs/testing';
import { RidesService } from './rides.service';
import { DataSource } from 'typeorm';
import { Passenger } from '../../src/passengers/entities/passenger.entity';
import { Driver } from '../../src/drivers/entities/driver.entity';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../../src/config/db.config';
import { Ride } from './entities/ride.entity';

describe('RidesService', () => {
  let ridesService: RidesService;
  let dataSource: DataSource;
  let driverId: string;
  let passengerId: string;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
        TypeOrmModule.forFeature([Driver, Passenger, Ride]),
      ],
      providers: [RidesService],
    }).compile();

    ridesService = moduleRef.get<RidesService>(RidesService);
    dataSource = moduleRef.get<DataSource>(DataSource);

    await dataSource.createQueryBuilder(Driver, 'driver').delete().execute();
    await dataSource
      .createQueryBuilder(Passenger, 'passenger')
      .delete()
      .execute();

    const newDriver = new Driver();
    newDriver.name = faker.person.fullName();
    newDriver.phone = '+25710000001';
    const driver = await dataSource.manager.save(newDriver);

    driverId = driver.id;

    const newPassenger = new Passenger();
    newPassenger.name = faker.person.fullName();
    newPassenger.phone = '+25710000001';
    const passenger = await dataSource.manager.save(newPassenger);

    passengerId = passenger.id;
  });

  it('should be defined', () => {
    expect(ridesService).toBeDefined();
  });
});
