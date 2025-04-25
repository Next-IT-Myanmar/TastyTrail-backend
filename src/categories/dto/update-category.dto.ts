import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'A description of the category',
    example: 'Electronic devices and accessories',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The image file for the category',
    type: 'string',
    format: 'binary',
    required: false
  })
  img?: Express.Multer.File;

  @ApiProperty({
    description: 'The date when the category was created',
    required: false
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;
}