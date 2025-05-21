import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { Newsletter } from './entities/newsletter.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse as ApiResponseInterface } from '../common/interfaces/api-response.interface';
import { SingleNewsletterResponseDto, PaginatedNewsletterResponseDto } from './dto/newsletter-response.dto';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, description: 'Successfully subscribed to newsletter', type: SingleNewsletterResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  async create(@Body() createNewsletterDto: CreateNewsletterDto): Promise<ApiResponseInterface<Newsletter>> {
    const newsletter = await this.newsletterService.create(createNewsletterDto);
    return this.newsletterService.buildResponse(newsletter, 'Successfully subscribed to newsletter');
  }

  @Get()
  @ApiOperation({ summary: 'Get all newsletter subscriptions' })
  @ApiResponse({ status: 200, description: 'List of all newsletter subscriptions', type: PaginatedNewsletterResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() paginationDto: PaginationDto): Promise<ApiResponseInterface<Newsletter[]>> {
    const { results, pagination } = await this.newsletterService.findAll(paginationDto);
    return this.newsletterService.buildResponse(results, 'Newsletter subscriptions retrieved successfully', pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a newsletter subscription by ID' })
  @ApiResponse({ status: 200, description: 'Newsletter subscription details', type: SingleNewsletterResponseDto })
  @ApiResponse({ status: 404, description: 'Newsletter subscription not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseInterface<Newsletter>> {
    const newsletter = await this.newsletterService.findOne(id);
    return this.newsletterService.buildResponse(newsletter, 'Newsletter subscription retrieved successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a newsletter subscription' })
  @ApiResponse({ status: 200, description: 'Newsletter subscription deleted successfully' })
  @ApiResponse({ status: 404, description: 'Newsletter subscription not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseInterface<null>> {
    await this.newsletterService.remove(id);
    return this.newsletterService.buildResponse(null, 'Newsletter subscription deleted successfully');
  }
}