import { PageMetaDto } from 'src/dto/page-meta.dto';
import { RidesPageOptionsDto } from './rides-page-options.dto';
import { ERidesPageOptionsSort } from '../rides.constants';

export interface IRidesMetaDtoParameters {
  ridesPageOptionsDto: RidesPageOptionsDto;
  itemCount: number;
}

export class RidesPageMetaDto extends PageMetaDto {
  readonly keyword: string;

  readonly sort: ERidesPageOptionsSort;

  constructor({ ridesPageOptionsDto, itemCount }: IRidesMetaDtoParameters) {
    super({ pageOptionsDto: ridesPageOptionsDto, itemCount });
    this.keyword = ridesPageOptionsDto.keyword;
    this.sort = ridesPageOptionsDto.sort;
  }
}
