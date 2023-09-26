import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Driver } from './entities/driver.entity';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Post(':id/suspended')
  suspend(@Param('id', ParseUUIDPipe) driverId: string): Promise<Driver> {
    return this.driversService.suspend(driverId);
  }
}
