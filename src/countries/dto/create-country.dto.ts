import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
}