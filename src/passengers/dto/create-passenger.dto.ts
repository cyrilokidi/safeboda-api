import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}
