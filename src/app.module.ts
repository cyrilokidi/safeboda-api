import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { DriversModule } from './drivers/drivers.module';
import { PassengersModule } from './passengers/passengers.module';
import { RidesModule } from './rides/rides.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(dbConfig),
    DriversModule,
    PassengersModule,
    RidesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
