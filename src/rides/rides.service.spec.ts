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
import { RidesPageOptionsDto } from './dto/rides-page-options.dto';
import { RidesPageMetaDto } from './dto/rides-page-meta.dto';

describe('RidesService', () => {
  let ridesService: RidesService;
  let dataSource: DataSource;

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
  });

  it('should be defined', () => {
    expect(ridesService).toBeDefined();
  });

  it('should return new ride details', async () => {
    const newPassenger = new Passenger();
    newPassenger.name = faker.person.fullName();
    newPassenger.phone = '+25710000001';
    const passenger = await dataSource.manager.save(newPassenger);

    const newDriver = new Driver();
    newDriver.name = faker.person.fullName();
    newDriver.phone = '+25710000001';
    const driver = await dataSource.manager.save(newDriver);

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

  it('should return details of stopped ride', async () => {
    const newPassenger = new Passenger();
    newPassenger.name = faker.person.fullName();
    newPassenger.phone = '+25710000002';
    const passenger = await dataSource.manager.save(newPassenger);

    const newDriver = new Driver();
    newDriver.name = faker.person.fullName();
    newDriver.phone = '+25710000002';
    const driver = await dataSource.manager.save(newDriver);

    const newRide = new Ride();
    newRide.passenger = passenger;
    newRide.driver = driver;
    newRide.pickupPointLatitude = faker.location.latitude();
    newRide.pickupPointLongitude = faker.location.longitude();
    newRide.destinationLatitude = faker.location.latitude();
    newRide.destinationLongitude = faker.location.longitude();
    const ride = await dataSource.manager.save(newRide);

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

  it('should return all ongoing rides', async () => {
    const newPassenger = new Passenger();
    newPassenger.name = faker.person.fullName();
    newPassenger.phone = '+25710000003';
    const passenger = await dataSource.manager.save(newPassenger);

    const newDriver = new Driver();
    newDriver.name = faker.person.fullName();
    newDriver.phone = '+25710000003';
    const driver = await dataSource.manager.save(newDriver);

    const newRide = new Ride();
    newRide.passenger = passenger;
    newRide.driver = driver;
    newRide.pickupPointLatitude = faker.location.latitude();
    newRide.pickupPointLongitude = faker.location.longitude();
    newRide.destinationLatitude = faker.location.latitude();
    newRide.destinationLongitude = faker.location.longitude();
    const ride = await dataSource.manager.save(newRide);

    const ridesPageOptionsDto = new RidesPageOptionsDto();
    const response = await ridesService.findAll(ridesPageOptionsDto);

    expect(response.meta).toBeInstanceOf(RidesPageMetaDto);
    expect(response).toEqual({
      data: expect.any(Array),
      meta: {
        hasNextPage: expect.any(Boolean),
        hasPreviousPage: expect.any(Boolean),
        itemCount: expect.any(Number),
        keyword: undefined,
        order: 'DESC',
        page: expect.any(Number),
        pageCount: expect.any(Number),
        sort: 'ride.createdAt',
        take: expect.any(Number),
      },
    });
  });
});
