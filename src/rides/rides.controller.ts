import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './entities/ride.entity';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post(':passengerId/:driverId')
  create(
    @Param('passengerId', ParseUUIDPipe) passengerId: string,
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() createRideDto: CreateRideDto,
  ) {
    return this.ridesService.create(passengerId, driverId, createRideDto);
  }

  @Patch(':id/stop')
  stopRide(@Param('id', ParseUUIDPipe) rideId: string): Promise<Ride> {
    return this.ridesService.stop(rideId);
  }
}
