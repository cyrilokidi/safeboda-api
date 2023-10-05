import { IsNotEmpty, IsLatitude, IsLongitude } from 'class-validator';

export class CreateRideDto {
  @IsLatitude()
  @IsNotEmpty()
  pickupPointLatitude: number;

  @IsLongitude()
  @IsNotEmpty()
  pickupPointLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  destinationLatitude: number;

  @IsLongitude()
  @IsNotEmpty()
  destinationLongitude: number;
}
