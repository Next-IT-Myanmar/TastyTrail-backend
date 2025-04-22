import { ApiProperty } from '@nestjs/swagger';
import { Cuisine } from '../entities/cuisine.entity';
import { PaginationInfo } from '../../common/interfaces/api-response.interface';

export class PaginatedCuisineResponseDto {
  @ApiProperty({
    description: 'Array of cuisine objects',
    type: [Cuisine]
  })
  data: Cuisine[];

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
    example: 'Cuisines retrieved successfully'
  })
  message: string;
}

export class SingleCuisineResponseDto {
  @ApiProperty({
    description: 'Cuisine object',
    type: Cuisine
  })
  data: Cuisine;

  @ApiProperty({
    description: 'Response message',
    example: 'Cuisine retrieved successfully'
  })
  message: string;
}