import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSliderDto {
  @ApiProperty({ example: 'Main Slider' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is a description for the slider' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  // Timestamps are handled automatically by the database
}