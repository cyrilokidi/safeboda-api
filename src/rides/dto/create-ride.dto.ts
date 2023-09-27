import { IsUUID, IsNotEmpty, IsLatitude, IsLongitude } from 'class-validator';

export class CreateRideDto {
  @IsUUID()
  @IsNotEmpty()
  driverId: string;

  @IsUUID()
  @IsNotEmpty()
  passengerId: string;

  @IsLatitude()
  @IsNotEmpty()
  pickupPointLatitude: number;

  @IsLatitude()
  @IsNotEmpty()
  pickupPointLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  destinationLatitude: number;

  @IsLatitude()
  @IsNotEmpty()
  destinationLongitude: number;
}
