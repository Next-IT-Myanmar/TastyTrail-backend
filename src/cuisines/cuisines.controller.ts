import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CuisinesService } from './cuisines.service';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';
import { Cuisine } from './entities/cuisine.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse as ApiResponseInterface } from '../common/interfaces/api-response.interface';
import { PaginatedCuisineResponseDto, SingleCuisineResponseDto } from './dto/cuisine-response.dto';

@ApiTags('Cuisines')
@Controller('cuisines')
export class CuisinesController {
  constructor(private readonly cuisinesService: CuisinesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cuisine' })
  @ApiResponse({ status: 201, description: 'Cuisine created successfully', type: SingleCuisineResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Cuisine name' },
        description: { type: 'string', description: 'Cuisine description' },
        image: { type: 'string', format: 'binary', description: 'Cuisine image' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCuisineDto: CreateCuisineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cuisinesService.create(createCuisineDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cuisines' })
  @ApiResponse({ status: 200, description: 'List of all cuisines', type: PaginatedCuisineResponseDto })
  async findAll(@Query() paginationDto: PaginationDto): Promise<ApiResponseInterface<Cuisine[]>> {
    const { results, pagination } = await this.cuisinesService.findAll(paginationDto);
    return this.cuisinesService.buildPaginatedResponse(results, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cuisine by ID' })
  @ApiResponse({ status: 200, description: 'Cuisine found', type: SingleCuisineResponseDto })
  @ApiResponse({ status: 404, description: 'Cuisine not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseInterface<Cuisine>> {
    const cuisine = await this.cuisinesService.findOne(id);
    return {
      data: cuisine,
      message: 'Cuisine retrieved successfully'
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cuisine' })
  @ApiResponse({ status: 200, description: 'Cuisine updated successfully', type: SingleCuisineResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cuisine not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Cuisine name' },
        description: { type: 'string', description: 'Cuisine description' },
        image: { type: 'string', format: 'binary', description: 'Cuisine image' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCuisineDto: UpdateCuisineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cuisinesService.update(id, updateCuisineDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cuisine' })
  @ApiResponse({ status: 200, description: 'Cuisine deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cuisine not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cuisinesService.remove(id);
  }
}