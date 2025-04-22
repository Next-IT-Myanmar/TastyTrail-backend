import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of cuisine IDs to update',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  cuisineIds?: number[] | string;
}