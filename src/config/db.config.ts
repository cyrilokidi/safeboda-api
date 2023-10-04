import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Driver } from '../drivers/entities/driver.entity';
import { Passenger } from '../passengers/entities/passenger.entity';
import { Ride } from '../rides/entities/ride.entity';

export const testDbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: 'postgres',
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT),
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    schema: process.env.TEST_DB_SCHEMA,
    synchronize: true,
    entities: [Driver, Passenger, Ride],
  }),
};

export const dbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    synchronize: true,
    entities: [Driver, Passenger, Ride],
  }),
};
