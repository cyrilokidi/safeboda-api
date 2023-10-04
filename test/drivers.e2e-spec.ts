import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DriversModule } from '../src/drivers/drivers.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../src/config/db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateDriverDto } from 'src/drivers/dto/create-driver.dto';

describe('DriverController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
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
    const token = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    console.log('token: ', token.status);

    accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJva2lkaWN5cmlsQGdtYWlsLmNvbSIsImlhdCI6MTY5NjM5Njk4NywiZXhwIjoxNjk2NDgzMzg3fQ.IxjyYwLdV2WS0mSX8TPQyEvocDQz9mmmofSFi8mQt6g';
  });

  it('/ (POST)', () => {
    const createDriverDto: CreateDriverDto = {
      name: 'John Doe',
      phone: '+254700000001',
    };
    return request(app.getHttpServer())
      .post('/drivers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createDriverDto)
      .expect(201)
      .expect('Hello World!');
  });
});
