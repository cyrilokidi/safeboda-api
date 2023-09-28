import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Passenger } from './entities/passenger.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    return this.passengersService.create(createPassengerDto);
  }
}
