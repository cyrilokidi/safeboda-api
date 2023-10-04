import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../src/config/db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginDto } from '../src/auth/dto/login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { PassengersModule } from '../src/passengers/passengers.module';
import { CreatePassengerDto } from 'src/passengers/dto/create-passenger.dto';

describe('PassengerController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
        AuthModule,
        PassengersModule,
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

  describe('/passengers (POST)', () => {
    it('should return new passenger details', async () => {
      const createPassengerDto: CreatePassengerDto = {
        name: 'Edwin Green',
        phone: '+254700000005',
      };
      const response = await request(app.getHttpServer())
        .post('/passengers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPassengerDto);
      expect(response.status).toBe(201);
    });

    it('should fail with unauthorized error', async () => {
      const createPassengerDto: CreatePassengerDto = {
        name: 'Snoop Dogg',
        phone: '+254700000006',
      };
      const response = await request(app.getHttpServer())
        .post('/passengers')
        .send(createPassengerDto);
      expect(response.status).toBe(401);
    });

    it('should fail with bad request error', async () => {
      const response = await request(app.getHttpServer())
        .post('/passengers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
