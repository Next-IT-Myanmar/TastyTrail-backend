import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { CreateCuisineDto } from './create-cuisine.dto';

export class UpdateCuisineDto extends PartialType(CreateCuisineDto) {
  @ApiProperty({ example: 'Italian Cuisine', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Traditional Italian cooking styles and dishes', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;

  @ApiProperty({ 
    description: 'The date when the cuisine was created',
    example: '2024-01-20T10:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;
}