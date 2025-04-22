// CreateRestaurantDto
import { IsString, IsUrl, IsNotEmpty, IsArray, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Restaurant Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'A detailed description of the restaurant' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  img: Express.Multer.File;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Additional photos of the restaurant' })
  @IsOptional()
  otherPhoto?: Express.Multer.File[];

  @ApiProperty({ example: 'https://maps.google.com/...' })
  @IsUrl()
  @IsNotEmpty()
  map: string;

  @ApiProperty({ example: '123 Main Street, City, Country' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  openHour: string;

  @ApiProperty({ example: '22:00' })
  @IsString()
  @IsNotEmpty()
  closeHour: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value !== undefined ? parseInt(value, 10) : undefined)
  @ApiProperty({ example: 1, description: 'Rank of the restaurant', required: false })
  rank?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value !== undefined ? parseInt(value, 10) : undefined)
  @ApiProperty({ example: 2, description: 'Price range of the restaurant (1-5, where 1 is cheapest and 5 is most expensive)', required: false })
  priceRange?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({ example: true, description: 'Whether the restaurant has a promotion', required: false })
  isPromotion?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value !== undefined ? parseInt(value, 10) : undefined)
  @ApiProperty({ example: 15, description: 'Promotion rate as a percentage (e.g., 15 for 15% off)', required: false })
  promoRate?: number;

  @ApiProperty({ example: [1, 2, 3], description: 'Array of category IDs associated with the restaurant' })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => 
    typeof value === 'string' ? value.split(',').map((item) => parseInt(item.trim(), 10)) : value
  )
  categoryIds?: string | string[] | number[];   // Change to number[]

  @ApiProperty({ example: ['uuid1', 'uuid2'], description: 'Array of country UUIDs' })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((item) => item.trim()) : value
  )
  countryIds?: string[] | string;

  @ApiProperty({ example: [1, 2, 3], description: 'Array of cuisine IDs associated with the restaurant' })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => 
    typeof value === 'string' ? value.split(',').map((item) => parseInt(item.trim(), 10)) : value
  )
  cuisineIds?: string | string[] | number[];

  @ApiProperty({
    example: {
      facebook: 'www.facebook.com/restaurant',
      whatsapp: 'www.whatsapp.com/restaurant',
      twitter: 'www.twitter.com/restaurant'
    },
    description: 'Social media links of the restaurant',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  socialLink?: Record<string, string>;
}


