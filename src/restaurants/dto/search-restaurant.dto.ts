import { IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchRestaurantDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Country ID to filter restaurants',
    required: false
  })
  @IsUUID()
  @IsOptional()
  countryId?: string;

  @ApiProperty({
    example: 'Shwe',
    description: 'Keyword to search in restaurant name and description',
    required: false
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}
