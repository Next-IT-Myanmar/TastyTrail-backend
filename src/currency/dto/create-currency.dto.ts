import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, Min, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'The buy rate of the currency',
    example: 1.25,
    minimum: 0
  })
  @Transform(({ value }) => value !== undefined ? parseFloat(value) : undefined)
  @IsNumber()
  @Min(0)
  buy: number;

  @ApiProperty({
    description: 'The status of buy rate',
    example: true
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  buyStatus: boolean;

  @ApiProperty({
    description: 'The sell rate of the currency',
    example: 1.35,
    minimum: 0
  })
  @Transform(({ value }) => value !== undefined ? parseFloat(value) : undefined)
  @IsNumber()
  @Min(0)
  sell: number;

  @ApiProperty({
    description: 'The status of sell rate',
    example: true
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  sellStatus: boolean;

  @ApiProperty({
    description: 'The currency code',
    example: 'USD',
    required: false
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: 'The image file for the currency',
    type: 'string',
    format: 'binary',
    required: false
  })
  @IsOptional()
  img?: any; // Using 'any' type for Swagger compatibility
}