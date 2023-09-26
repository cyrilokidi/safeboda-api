import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';

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
    entities: [Driver, Passenger],
  }),
};
