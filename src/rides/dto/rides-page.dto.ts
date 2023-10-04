import { IsArray } from 'class-validator';
import { PageDto } from '../../dto/page.dto';
import { Ride } from '../entities/ride.entity';
import { RidesPageMetaDto } from './rides-page-meta.dto';

export class RidesPageDto extends PageDto<Ride> {
  @IsArray()
  readonly data: Ride[];

  readonly meta: RidesPageMetaDto;

  constructor(data: Ride[], meta: RidesPageMetaDto) {
    super(data, meta);
    this.data = data;
    this.meta = meta;
  }
}
