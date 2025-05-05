import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, Min, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateCurrencyDto } from './create-currency.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {
  @ApiProperty({
    description: 'The buy rate of the currency',
    example: 1.25,
    minimum: 0,
    required: false
  })
  @Transform(({ value }) => value !== undefined ? parseFloat(value) : undefined)
  @IsNumber()
  @IsOptional()
  @Min(0)
  buy?: number;

  @ApiProperty({
    description: 'The status of buy rate',
    example: true,
    required: false
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  buyStatus?: boolean;

  @ApiProperty({
    description: 'The sell rate of the currency',
    example: 1.35,
    minimum: 0,
    required: false
  })
  @Transform(({ value }) => value !== undefined ? parseFloat(value) : undefined)
  @IsNumber()
  @IsOptional()
  @Min(0)
  sell?: number;

  @ApiProperty({
    description: 'The status of sell rate',
    example: true,
    required: false
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  sellStatus?: boolean;

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