import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { PaginationInfo } from '../../common/interfaces/api-response.interface';

export class PaginatedCategoryResponseDto {
  @ApiProperty({
    description: 'Array of category objects',
    type: [Category]
  })
  data: Category[];

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
    example: 'Categories retrieved successfully'
  })
  message: string;
}

export class SingleCategoryResponseDto {
  @ApiProperty({
    description: 'Category object',
    type: Category
  })
  data: Category;

  @ApiProperty({
    description: 'Response message',
    example: 'Category retrieved successfully'
  })
  message: string;
}