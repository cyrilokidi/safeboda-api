import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
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

  suspend(driverId: string): Promise<void> {
    return this.dataSource.transaction(async (entityManager) => {
      const driver = await entityManager.findOneBy(Driver, {
        id: driverId,
      });
      if (!driver) throw new NotFoundException('Driver not found.');
      const driverSuspendUpdate = entityManager.merge(Driver, driver, {
        suspended: true,
      });
      await entityManager.save(driverSuspendUpdate);
      return;
    });
  }

  deleteSuspend(driverId: string): Promise<void> {
    return this.dataSource.transaction(async (entityManager) => {
      const driver = await entityManager.findOneBy(Driver, {
        id: driverId,
      });
      if (!driver) throw new NotFoundException('Driver not found.');
      const driverSuspendUpdate = entityManager.merge(Driver, driver, {
        suspended: false,
      });
      await entityManager.save(driverSuspendUpdate);
      return;
    });
  }
}
