import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DriversModule } from '../src/drivers/drivers.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../src/config/db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginDto } from '../src/auth/dto/login.dto';
import { CreateDriverDto } from '../src/drivers/dto/create-driver.dto';
import { AuthModule } from '../src/auth/auth.module';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { Driver } from '../src/drivers/entities/driver.entity';

describe('DriverController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
        AuthModule,
        DriversModule,
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

    dataSource = await moduleFixture.resolve<DataSource>(DataSource);

    await dataSource.createQueryBuilder(Driver, 'driver').delete().execute();

    const loginDto: LoginDto = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    accessToken = authResponse.body.accessToken as string;
  });

  describe('/drivers (POST)', () => {
    it('should return new driver details', async () => {
      const createDriverDto: CreateDriverDto = {
        name: faker.person.fullName(),
        phone: '+254710000001',
      };

      const response = await request(app.getHttpServer())
        .post('/drivers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDriverDto);
      expect(response.status).toBe(201);
    });

    it('should fail with unauthorized error', async () => {
      const createDriverDto: CreateDriverDto = {
        name: faker.person.fullName(),
        phone: '+254710000002',
      };
      const response = await request(app.getHttpServer())
        .post('/drivers')
        .send(createDriverDto);
      expect(response.status).toBe(401);
    });

    it('should fail with bad request error', async () => {
      const response = await request(app.getHttpServer())
        .post('/drivers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('/drivers/:id/suspended (GET)', () => {
    let driverId: string;

    beforeEach(async () => {
      const createDriverDto: CreateDriverDto = {
        name: faker.person.fullName(),
        phone: '+254710000003',
      };
      const response = await request(app.getHttpServer())
        .post('/drivers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDriverDto);
      driverId = response.body.id as string;
    });

    it('should suspend driver', async () => {
      const response = await request(app.getHttpServer())
        .post(`/drivers/${driverId}/suspended`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();
      expect(response.status).toBe(204);
    });

    it('should fail with unauthorized error', async () => {
      const response = await request(app.getHttpServer())
        .post(`/drivers/${driverId}/suspended`)
        .send();
      expect(response.status).toBe(401);
    });

    it('should fail with bad request error', async () => {
      const response = await request(app.getHttpServer())
        .post('/drivers/invalidDriverId/suspended')
        .set('Authorization', `Bearer ${accessToken}`)
        .send();
      expect(response.status).toBe(400);
    });
  });

  describe('/drivers/:id/suspended (DELETE)', () => {
    let driverId: string;

    beforeEach(async () => {
      const createDriverDto: CreateDriverDto = {
        name: faker.person.fullName(),
        phone: '+254710000004',
      };
      const newDriverResponse = await request(app.getHttpServer())
        .post('/drivers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createDriverDto);
      await request(app.getHttpServer())
        .post(`/drivers/${newDriverResponse.body.id as string}/suspended`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();
      driverId = newDriverResponse.body.id as string;
    });

    it('should delete driver suspend', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/drivers/${driverId}/suspended`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();
      expect(response.status).toBe(204);
    });

    it('should fail with unauthorized error', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/drivers/${driverId}/suspended`)
        .send();
      expect(response.status).toBe(401);
    });

    it('should fail with bad request error', async () => {
      const response = await request(app.getHttpServer())
        .delete('/drivers/invalidDriverId/suspended')
        .set('Authorization', `Bearer ${accessToken}`)
        .send();
      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
