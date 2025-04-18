import { Repository } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';

export class BaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async paginate(queryBuilder: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [results, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      results,
      pagination: {
        page,
        limit,
        total
      }
    };
  }

  buildPaginatedResponse(results: T[], pagination: any, message: string = 'Operation completed successfully') {
    return {
      data: results,
      pagination,
      message
    };
  }
}