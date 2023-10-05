import { Test, TestingModule } from '@nestjs/testing';
import { PassengersService } from './passengers.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from '../../src/config/db.config';
import { faker } from '@faker-js/faker';
import { CreatePassengerDto } from './dto/create-passenger.dto';

describe('PassengersService', () => {
  let passengersService: PassengersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync(testDbConfig),
      ],
      providers: [PassengersService],
    }).compile();

    passengersService = module.get<PassengersService>(PassengersService);
  });

  it('should be defined', () => {
    expect(passengersService).toBeDefined();
  });

  it('should return new passenger details', async () => {
    const createPassengerDto: CreatePassengerDto = {
      name: faker.person.fullName(),
      phone: '+25510000001',
    };
    const response = await passengersService.create(createPassengerDto);
    expect(response).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      ...createPassengerDto,
    });
  });
});
