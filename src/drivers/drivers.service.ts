import { Injectable, ConflictException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DataSource, TypeORMError } from 'typeorm';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriversService {
  constructor(private readonly dataSource: DataSource) {}

  create(createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.dataSource.transaction(async (entityManager) => {
      try {
        const newDriver = new Driver();
        newDriver.name = createDriverDto.name;
        newDriver.phone = createDriverDto.phone;
        return await entityManager.save(newDriver);
      } catch (error: TypeORMError | any) {
        if (
          error instanceof TypeORMError &&
          error['constraint'] === 'UQ_b97a5a68c766d2d1ec25e6a85b2'
        )
          throw new ConflictException(
            `"${createDriverDto.phone}" is already available.`,
          );
        throw error;
      }
    });
  }

  findAll() {
    return `This action returns all drivers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
