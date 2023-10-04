import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../src/config/db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../src/auth/auth.module';
import { LoginDto } from 'src/auth/dto/login.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
        AuthModule,
      ],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/login (POST)', () => {
    it('should signin user', () => {
      const loginDto: LoginDto = {
        email: 'okidicyril@gmail.com',
        password: 'password',
      };
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);
    });
  });
});
