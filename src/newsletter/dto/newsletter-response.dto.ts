import { ApiProperty } from '@nestjs/swagger';
import { Newsletter } from '../entities/newsletter.entity';

export class SingleNewsletterResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({ description: 'Response message', example: 'Newsletter subscription created successfully' })
  message: string;

  @ApiProperty({ description: 'Newsletter subscription data', type: Newsletter })
  data: Newsletter;
}

export class PaginatedNewsletterResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({ description: 'Response message', example: 'Newsletter subscriptions retrieved successfully' })
  message: string;

  @ApiProperty({ description: 'Newsletter subscription data', type: [Newsletter] })
  data: Newsletter[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 10
    }
  })
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}