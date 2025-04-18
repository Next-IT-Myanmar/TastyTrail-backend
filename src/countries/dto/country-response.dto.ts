import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../entities/country.entity';
import { PaginationInfo } from '../../common/interfaces/api-response.interface';

export class PaginatedCountryResponseDto {
  @ApiProperty({
    description: 'Array of country objects',
    type: [Country]
  })
  data: Country[];

  @ApiProperty({
    description: 'Pagination information',
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      total: { type: 'number', example: 100 }
    }
  })
  pagination: PaginationInfo;

  @ApiProperty({
    description: 'Response message',
    example: 'Countries retrieved successfully'
  })
  message: string;
}

export class SingleCountryResponseDto {
  @ApiProperty({
    description: 'Country object',
    type: Country
  })
  data: Country;

  @ApiProperty({
    description: 'Response message',
    example: 'Country retrieved successfully'
  })
  message: string;
}