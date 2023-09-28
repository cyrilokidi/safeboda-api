import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './entities/ride.entity';
import { RidesPageOptionsDto } from './dto/rides-page-options.dto';
import { RidesPageDto } from './dto/rides-page.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @UseGuards(AuthGuard)
  @Post(':passengerId/:driverId')
  create(
    @Param('passengerId', ParseUUIDPipe) passengerId: string,
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() createRideDto: CreateRideDto,
  ) {
    return this.ridesService.create(passengerId, driverId, createRideDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/stop')
  stopRide(@Param('id', ParseUUIDPipe) rideId: string): Promise<Ride> {
    return this.ridesService.stop(rideId);
  }

  @UseGuards(AuthGuard)
  @Get('ongoing')
  findAll(
    @Query() ridesPageOptionsDto: RidesPageOptionsDto,
  ): Promise<RidesPageDto> {
    return this.ridesService.findAll(ridesPageOptionsDto);
  }
}
