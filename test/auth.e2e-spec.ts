import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../src/auth/auth.module';
import { LoginDto } from '../src/auth/dto/login.dto';

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
    it('should return access token', async () => {
      const loginDto: LoginDto = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);
      expect(response.statusCode).toBe(201);
    });

    it('should fail with bad request error', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({});
      expect(response.statusCode).toBe(400);
    });

    it('should fail with unauthorized error', async () => {
      const [emailUsername, emailDomain] = process.env.ADMIN_EMAIL.split('@');
      const reversedEmailUsername = emailUsername.split('').reverse().join('');
      const loginDto: LoginDto = {
        email: `${reversedEmailUsername}@${emailDomain}`,
        password: process.env.ADMIN_PASSWORD,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);
      expect(response.statusCode).toBe(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
