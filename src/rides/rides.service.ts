import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Ride } from './entities/ride.entity';
import { DataSource } from 'typeorm';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';

@Injectable()
export class RidesService {
  constructor(private readonly dataSource: DataSource) {}

  create(createRideDto: CreateRideDto): Promise<Ride> {
    return this.dataSource.transaction(async (entityManager) => {
      try {
        const driver = await entityManager.findOneBy(Driver, {
          id: createRideDto.driverId,
        });
        if (!driver) throw new NotFoundException('Driver not found.');
        const passenger = await entityManager.findOneBy(Passenger, {
          id: createRideDto.passengerId,
        });
        if (!passenger) throw new NotFoundException('Passenger not found.');
        const newRide = new Ride();
        newRide.driver = driver;
        newRide.passenger = passenger;
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

  findAll() {
    return `This action returns all rides`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ride`;
  }

  update(id: number, updateRideDto: UpdateRideDto) {
    return `This action updates a #${id} ride`;
  }

  remove(id: number) {
    return `This action removes a #${id} ride`;
  }
}
