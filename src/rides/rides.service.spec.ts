import { Test, TestingModule } from '@nestjs/testing';
import { RidesService } from './rides.service';
import { DataSource } from 'typeorm';
import { Passenger } from '../../src/passengers/entities/passenger.entity';
import { Driver } from '../../src/drivers/entities/driver.entity';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../../src/config/db.config';
import { ERideStatus, Ride } from './entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';

describe('RidesService', () => {
  let ridesService: RidesService;
  let dataSource: DataSource;
  let passenger: Passenger;
  let driver: Driver;

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

    await dataSource
      .createQueryBuilder(Passenger, 'passenger')
      .delete()
      .execute();
    await dataSource.createQueryBuilder(Driver, 'driver').delete().execute();

    const newPassenger = new Passenger();
    newPassenger.name = faker.person.fullName();
    newPassenger.phone = '+25710000001';
    passenger = await dataSource.manager.save(newPassenger);

    const newDriver = new Driver();
    newDriver.name = faker.person.fullName();
    newDriver.phone = '+25710000001';
    driver = await dataSource.manager.save(newDriver);
  });

  it('should be defined', () => {
    expect(ridesService).toBeDefined();
  });

  it('should return new ride details', async () => {
    const createRideDto: CreateRideDto = {
      pickupPointLatitude: faker.location.latitude(),
      pickupPointLongitude: faker.location.longitude(),
      destinationLatitude: faker.location.latitude(),
      destinationLongitude: faker.location.longitude(),
    };
    const response = await ridesService.create(
      passenger.id,
      driver.id,
      createRideDto,
    );
    expect(response).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      passenger,
      driver,
      status: ERideStatus.ONGOING,
      ...createRideDto,
    });
  });

  describe('Stop ongoing ride', () => {
    let ride: Ride;

    beforeEach(async () => {
      const newRide = new Ride();
      newRide.passenger = passenger;
      newRide.driver = driver;
      newRide.pickupPointLatitude = faker.location.latitude();
      newRide.pickupPointLongitude = faker.location.longitude();
      newRide.destinationLatitude = faker.location.latitude();
      newRide.destinationLongitude = faker.location.longitude();
      ride = await dataSource.manager.save(newRide);
    });

    it('should return details of stopped ride', async () => {
      const response = await ridesService.stopRide(ride.id);
      expect(response).toEqual({
        id: expect.any(String),
        pickupPointLatitude: String(ride.pickupPointLatitude),
        pickupPointLongitude: String(ride.pickupPointLongitude),
        destinationLatitude: String(ride.destinationLatitude),
        destinationLongitude: String(ride.destinationLongitude),
        status: ERideStatus.DONE,
        createdAt: expect.any(Date),
      });
    });
  });
});
