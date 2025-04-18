import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterByCategoryDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of category IDs to filter restaurants by',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((id) => parseInt(id.trim(), 10)) : value
  )
  categoryIds?: number[];
}