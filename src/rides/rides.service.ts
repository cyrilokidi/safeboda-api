import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { ERideStatus, Ride } from './entities/ride.entity';
import { DataSource } from 'typeorm';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';

@Injectable()
export class RidesService {
  constructor(private readonly dataSource: DataSource) {}

  create(
    passengerId: string,
    driverId: string,
    createRideDto: CreateRideDto,
  ): Promise<Ride> {
    return this.dataSource.transaction(async (entityManager) => {
      try {
        const passenger = await entityManager.findOneBy(Passenger, {
          id: passengerId,
        });
        if (!passenger) throw new NotFoundException('Passenger not found.');
        const driver = await entityManager.findOneBy(Driver, {
          id: driverId,
        });
        if (!driver) throw new NotFoundException('Driver not found.');
        const newRide = new Ride();
        newRide.passenger = passenger;
        newRide.driver = driver;
        newRide.pickupPointLatitude = createRideDto.pickupPointLatitude;
        newRide.pickupPointLongitude = createRideDto.pickupPointLongitude;
        newRide.destinationLatitude = createRideDto.destinationLatitude;
        newRide.destinationLongitude = createRideDto.destinationLongitude;
        return await entityManager.save(newRide);
      } catch (error: any) {
        throw error;
      }
    });
  }

  stop(rideId: string): Promise<Ride> {
    return this.dataSource.transaction(async (entityManager) => {
      const ride = await entityManager.findOneBy(Ride, {
        id: rideId,
      });
      if (!ride) throw new NotFoundException('Ride not found.');
      const stopRideUpdate = entityManager.merge(Ride, ride, {
        status: ERideStatus['DONE'],
      });
      return await entityManager.save(stopRideUpdate);
    });
  }
}
