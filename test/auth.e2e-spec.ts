import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
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
        AuthModule,
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
  });

  describe('/auth/login (POST)', () => {
    it('should return access token', () => {
      const loginDto: LoginDto = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      };
      request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);
    });

    it('should fail with bad request error', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });

    it('should fail with unauthorized error', () => {
      const [emailUsername, emailDomain] = process.env.ADMIN_EMAIL.split('@');
      const reversedEmailUsername = emailUsername.split('').reverse().join('');
      const loginDto: LoginDto = {
        email: `${reversedEmailUsername}@${emailDomain}`,
        password: process.env.ADMIN_PASSWORD,
      };
      request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);
    });
  });
});
