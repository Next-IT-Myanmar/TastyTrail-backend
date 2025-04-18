import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';
import { PaginationInfo } from '../../common/interfaces/api-response.interface';

export class PaginatedRestaurantResponseDto {
  @ApiProperty({
    description: 'Array of restaurant objects',
    type: [Restaurant]
  })
  data: Restaurant[];

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
    example: 'Restaurants retrieved successfully'
  })
  message: string;
}

export class SingleRestaurantResponseDto {
  @ApiProperty({
    description: 'Restaurant object',
    type: Restaurant
  })
  data: Restaurant;

  @ApiProperty({
    description: 'Response message',
    example: 'Restaurant retrieved successfully'
  })
  message: string;
}