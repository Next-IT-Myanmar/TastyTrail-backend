import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'United States', description: 'Name of the country' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'A country in North America', description: 'Description of the country', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The flag image file for the country',
    type: 'string',
    format: 'binary',
    required: false
  })
  flag?: Express.Multer.File;

  @ApiProperty({ description: 'Creation timestamp of the country', required: false })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp of the country', required: false })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}