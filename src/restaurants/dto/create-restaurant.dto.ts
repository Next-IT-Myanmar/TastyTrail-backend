import { IsString, IsUrl, IsNotEmpty, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RestaurantRelationsDto } from './restaurant-relations.dto';

export class CreateRestaurantDto extends RestaurantRelationsDto {

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
}