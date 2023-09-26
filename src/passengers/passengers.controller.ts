import { Controller, Post, Body } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Passenger } from './entities/passenger.entity';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@Body() createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    return this.passengersService.create(createPassengerDto);
  }
}
