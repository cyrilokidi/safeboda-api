import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Passenger } from './entities/passenger.entity';
import { DataSource, TypeORMError } from 'typeorm';

@Injectable()
export class PassengersService {
  constructor(private readonly dataSource: DataSource) {}

  create(createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    return this.dataSource.transaction(async (entityManager) => {
      try {
        const newPassenger = new Passenger();
        newPassenger.name = createPassengerDto.name;
        newPassenger.phone = createPassengerDto.phone;
        return await entityManager.save(newPassenger);
      } catch (error: TypeORMError | any) {
        if (
          error instanceof TypeORMError &&
          error['constraint'] === 'UQ_2069567a79248254d27ae8ba4e2'
        )
          throw new ConflictException(
            `"${createPassengerDto.phone}" is already available.`,
          );
        throw error;
      }
    });
  }
}
