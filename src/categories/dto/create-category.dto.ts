import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A description of the category',
    example: 'Electronic devices and accessories'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The image file for the category',
    type: 'string',
    format: 'binary',
    required: false
  })
  img?: Express.Multer.File;

  @ApiProperty({
    description: 'The date when the category was created',
    example: '2024-01-20T10:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({
    description: 'The date when the category was last updated',
    example: '2024-01-20T15:30:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}