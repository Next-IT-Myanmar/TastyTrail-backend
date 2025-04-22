import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterRestaurantDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of category IDs to filter restaurants by',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((id) => parseInt(id.trim(), 10))
      : Array.isArray(value)
      ? value.map((id) => (typeof id === 'string' ? parseInt(id, 10) : id))
      : value,
  )
  categoryIds?: number[];

  @ApiProperty({
    example: ['uuid1', 'uuid2'],
    description: 'Array of country IDs to filter restaurants by',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((id) => id.trim())
      : value,
  )
  countryIds?: string[];

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of cuisine IDs to filter restaurants by',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((id) => parseInt(id.trim(), 10))
      : Array.isArray(value)
      ? value.map((id) => (typeof id === 'string' ? parseInt(id, 10) : id))
      : value,
  )
  cuisineIds?: number[];
}