import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DriversModule } from '../src/drivers/drivers.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../src/config/db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('DriverController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        TypeOrmModule.forRootAsync(dbConfig),
        DriversModule,
      ],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/drivers')
      .send({})
      .expect(200)
      .expect('Hello World!');
  });
});
