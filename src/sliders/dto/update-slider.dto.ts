import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { CreateSliderDto } from './create-slider.dto';

export class UpdateSliderDto extends PartialType(CreateSliderDto) {
  @ApiProperty({ example: 'Main Slider', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'This is a description for the slider', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;

  @ApiProperty({ description: 'Creation timestamp of the slider', required: false })
  @IsOptional()
  @IsDate()
  createdAt?: Date;
}