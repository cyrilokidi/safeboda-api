import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../src/config/db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginDto } from '../src/auth/dto/login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { faker } from '@faker-js/faker';
import { RidesModule } from '../src/rides/rides.module';
import { CreateRideDto } from '../src/rides/dto/create-ride.dto';
import { CreatePassengerDto } from '../src/passengers/dto/create-passenger.dto';
import { CreateDriverDto } from '../src/drivers/dto/create-driver.dto';
import { DriversModule } from '../src/drivers/drivers.module';
import { PassengersModule } from '../src/passengers/passengers.module';

describe('RideController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
        AuthModule,
        DriversModule,
        PassengersModule,
        RidesModule,
      ],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();

    const loginDto: LoginDto = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    accessToken = authResponse.body.accessToken as string;
  });

  describe('/rides/:passengerId/:driverId (POST)', () => {
    let passengerId: string;
    let driverId: string;

    beforeEach(async () => {
      const createPassengerDto: CreatePassengerDto = {
        name: faker.person.fullName(),
        phone: '+254730000001',
      };
      const newPassengerResponse = await request(app.getHttpServer())
        .post('/passengers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPassengerDto);
      passengerId = newPassengerResponse.body.id as string;
      const createDriverDto: CreateDriverDto = {
        name: faker.person.fullName(),
        phone: '+254730000001',
      };
      const newDriverResponse = await request(app.getHttpServer())
        .post('/drivers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDriverDto);
      driverId = newDriverResponse.body.id as string;
    });

    it('should return new ongoing ride details', async () => {
      const createRideDto: CreateRideDto = {
        pickupPointLatitude: faker.location.latitude(),
        pickupPointLongitude: faker.location.longitude(),
        destinationLatitude: faker.location.latitude(),
        destinationLongitude: faker.location.longitude(),
      };
      const response = await request(app.getHttpServer())
        .post(`/rides/${passengerId}/${driverId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createRideDto);
      expect(response.status).toBe(201);
    });

    it('should fail with unauthorized error', async () => {
      const createRideDto: CreateRideDto = {
        pickupPointLatitude: faker.location.latitude(),
        pickupPointLongitude: faker.location.longitude(),
        destinationLatitude: faker.location.latitude(),
        destinationLongitude: faker.location.longitude(),
      };
      const response = await request(app.getHttpServer())
        .post(`/rides/${passengerId}/${driverId}`)
        .send(createRideDto);
      expect(response.status).toBe(401);
    });

    it('should fail with bad request error', async () => {
      const response = await request(app.getHttpServer())
        .post(`/rides/${passengerId}/${driverId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
