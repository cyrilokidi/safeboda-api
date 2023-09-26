import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Driver } from './entities/driver.entity';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @Post(':id/suspended')
  @HttpCode(204)
  suspend(@Param('id', ParseUUIDPipe) driverId: string): Promise<void> {
    return this.driversService.suspend(driverId);
  }

  @Delete(':id/suspended')
  @HttpCode(204)
  deleteSuspend(@Param('id', ParseUUIDPipe) driverId: string): Promise<void> {
    return this.driversService.deleteSuspend(driverId);
  }
}
