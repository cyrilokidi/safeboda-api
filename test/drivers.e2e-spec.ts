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

describe('DriverController (e2e)', () => {
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

  it('/ (POST)', async () => {
    const createDriverDto: CreateDriverDto = {
      name: 'John Doe',
      phone: '+254700000001',
    };
    const response = await request(app.getHttpServer())
      .post('/drivers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createDriverDto);
    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
