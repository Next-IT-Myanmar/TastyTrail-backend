import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchCurrencyDto {
  @ApiProperty({
    example: 'USD',
    description: 'Keyword to search in currency code',
    required: false
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}