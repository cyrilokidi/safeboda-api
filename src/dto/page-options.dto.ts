import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { EPageOptionsOrder } from 'src/app.constants';

export abstract class PageOptionsDto {
  @IsEnum(EPageOptionsOrder)
  @IsOptional()
  readonly order?: EPageOptionsOrder = EPageOptionsOrder.DESC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
