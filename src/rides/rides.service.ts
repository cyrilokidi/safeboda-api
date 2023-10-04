import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { ERideStatus, Ride } from './entities/ride.entity';
import { Brackets, DataSource, TypeORMError } from 'typeorm';
import { Driver } from '../drivers/entities/driver.entity';
import { Passenger } from '../passengers/entities/passenger.entity';
import { RidesPageOptionsDto } from './dto/rides-page-options.dto';
import { RidesPageDto } from './dto/rides-page.dto';
import { RidesPageMetaDto } from './dto/rides-page-meta.dto';

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
      } catch (error: TypeORMError | any) {
        if (
          error instanceof TypeORMError &&
          error['constraint'] === 'IDX_4a0bc9a1a754b7ac39519858f4'
        )
          throw new ConflictException('Passenger has ongoing ride.');
        if (
          error instanceof TypeORMError &&
          error['constraint'] === 'IDX_67831409d43797c8d62770f7b2'
        )
          throw new ConflictException('Driver has ongoing ride.');
        throw error;
      }
    });
  }

  stopRide(rideId: string): Promise<Ride> {
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

  async findAll(
    ridesPageOptionsDto: RidesPageOptionsDto,
  ): Promise<RidesPageDto> {
    const queryBuilder = this.dataSource
      .createQueryBuilder(Ride, 'ride')
      .innerJoinAndSelect('ride.passenger', 'passenger')
      .innerJoinAndSelect('ride.driver', 'driver')
      .where('ride.status = :status', {
        status: 'ongoing',
      });

    if (ridesPageOptionsDto.keyword)
      queryBuilder.andWhere(
        new Brackets((qb) =>
          qb
            .where('passenger.name ILIKE :keyword', {
              keyword: `%${ridesPageOptionsDto.keyword}%`,
            })
            .orWhere('driver.name ILIKE :keyword', {
              keyword: `%${ridesPageOptionsDto.keyword}%`,
            }),
        ),
      );

    queryBuilder
      .select(['ride', 'passenger', 'driver'])
      .orderBy(ridesPageOptionsDto.sort, ridesPageOptionsDto.order)
      .skip(ridesPageOptionsDto.skip)
      .take(ridesPageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const legacyVehiclesPageMetaDto = new RidesPageMetaDto({
      itemCount,
      ridesPageOptionsDto,
    });
    return new RidesPageDto(entities, legacyVehiclesPageMetaDto);
  }
}
