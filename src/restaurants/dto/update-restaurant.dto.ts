import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty({ 
    example: ['+1234567890', '+0987654321'], 
    description: 'Phone numbers of the restaurant',
    type: [String],
    isArray: true,
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => 
    typeof value === 'string' ? value.split(',').map(phone => phone.trim()) : value
  )
  phones?: string[];
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of cuisine IDs to update',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  cuisineIds?: number[] | string;

  @ApiProperty({ example: 2, description: 'Price range of the restaurant (1-5, where 1 is cheapest and 5 is most expensive)', required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value !== undefined ? parseInt(value, 10) : undefined)
  priceRange?: number;

  @ApiProperty({ example: true, description: 'Whether the restaurant has a promotion', required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isPromotion?: boolean;

  @ApiProperty({ example: 15, description: 'Promotion rate as a percentage (e.g., 15 for 15% off)', required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value !== undefined ? parseInt(value, 10) : undefined)
  promoRate?: number;
}