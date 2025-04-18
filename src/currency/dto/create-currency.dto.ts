import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'The buy rate of the currency',
    example: 1.25,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  buy: number;

  @ApiProperty({
    description: 'The status of buy rate',
    example: true
  })
  @IsBoolean()
  buyStatus: boolean;

  @ApiProperty({
    description: 'The sell rate of the currency',
    example: 1.35,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  sell: number;

  @ApiProperty({
    description: 'The status of sell rate',
    example: true
  })
  @IsBoolean()
  sellStatus: boolean;
}