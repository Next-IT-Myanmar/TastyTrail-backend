import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, Min, IsOptional } from 'class-validator';
import { CreateCurrencyDto } from './create-currency.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {
  @ApiProperty({
    description: 'The buy rate of the currency',
    example: 1.25,
    minimum: 0,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  buy?: number;

  @ApiProperty({
    description: 'The status of buy rate',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  buyStatus?: boolean;

  @ApiProperty({
    description: 'The sell rate of the currency',
    example: 1.35,
    minimum: 0,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  sell?: number;

  @ApiProperty({
    description: 'The status of sell rate',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  sellStatus?: boolean;
}