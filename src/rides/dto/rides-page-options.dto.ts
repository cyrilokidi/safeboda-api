import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { ERidesPageOptionsSort } from '../rides.constants';

export class RidesPageOptionsDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  readonly keyword?: string;

  @IsEnum(ERidesPageOptionsSort)
  @IsOptional()
  readonly sort?: ERidesPageOptionsSort =
    ERidesPageOptionsSort['ride.createdAt'];
}
