import { IsString, IsNotEmpty } from 'class-validator';
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
}