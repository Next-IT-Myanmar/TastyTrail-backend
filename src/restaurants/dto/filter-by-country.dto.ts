import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterByCountryDto {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'Array of country IDs to filter restaurants by',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.includes(',') ? value.split(',') : [value];
    }
    return [];
  })
  countryIds?: string[];
}
