import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCuisineDto {
  @ApiProperty({ example: 'Italian Cuisine' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Traditional Italian cooking styles and dishes' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  @ApiProperty({ 
    description: 'The date when the cuisine was created',
    example: '2024-01-20T10:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({
    description: 'The date when the cuisine was last updated',
    example: '2024-01-20T15:30:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}