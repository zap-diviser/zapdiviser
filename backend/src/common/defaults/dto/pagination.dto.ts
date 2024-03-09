import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQuery {
  @ApiProperty({
    minimum: 0,
    title: 'Page',
    default: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    minimum: 1,
    maximum: 100,
    default: 10,
    title: 'Limit',
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @IsOptional()
  @Max(100)
  limit: number = 10;
}
