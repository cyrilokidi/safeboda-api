import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Driver } from './entities/driver.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @UseGuards(AuthGuard)
  @Post(':id/suspended')
  @HttpCode(204)
  suspend(@Param('id', ParseUUIDPipe) driverId: string): Promise<void> {
    return this.driversService.suspend(driverId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/suspended')
  @HttpCode(204)
  deleteSuspend(@Param('id', ParseUUIDPipe) driverId: string): Promise<void> {
    return this.driversService.deleteSuspend(driverId);
  }
}
