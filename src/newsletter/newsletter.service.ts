import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter)
    private readonly newsletterRepository: Repository<Newsletter>,
  ) {}

  async create(createNewsletterDto: CreateNewsletterDto): Promise<Newsletter> {
    // Check if email already exists
    const existingSubscription = await this.newsletterRepository.findOne({
      where: { email: createNewsletterDto.email },
    });

    if (existingSubscription) {
      throw new ConflictException('Email is already subscribed to the newsletter');
    }

    const newsletter = this.newsletterRepository.create(createNewsletterDto);
    return this.newsletterRepository.save(newsletter);
  }

  async findAll(paginationDto: PaginationDto): Promise<{ results: Newsletter[]; pagination: any }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [results, total] = await this.newsletterRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const pagination = {
      page,
      limit,
      total,
    };

    return { results, pagination };
  }

  async findOne(id: number): Promise<Newsletter> {
    const newsletter = await this.newsletterRepository.findOne({ where: { id } });
    if (!newsletter) {
      throw new NotFoundException(`Newsletter subscription with ID ${id} not found`);
    }
    return newsletter;
  }

  async remove(id: number): Promise<void> {
    const result = await this.newsletterRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Newsletter subscription with ID ${id} not found`);
    }
  }

  buildResponse(data: Newsletter | Newsletter[], message: string, pagination?: any): ApiResponse<any> {
    return {
      data,
      message,
      pagination,
    };
  }
}