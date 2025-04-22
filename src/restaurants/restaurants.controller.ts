import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe, Query, ClassSerializerInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PaginatedRestaurantResponseDto, SingleRestaurantResponseDto } from './dto/restaurant-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse as ApiResponseInterface } from '../common/interfaces/api-response.interface';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';
@ApiTags('restaurants')
@Controller('restaurants')
@UseInterceptors(ClassSerializerInterceptor)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search restaurants by keyword and country' })
  search(@Query() searchDto: SearchRestaurantDto) {
    return this.restaurantsService.search(searchDto);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully', type: Restaurant })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Restaurant Name' },
        description: { type: 'string', example: 'A detailed description of the restaurant' },
        img: { type: 'string', format: 'binary', description: 'Restaurant image' },
        map: { type: 'string', example: 'https://maps.google.com/...' },
        address: { type: 'string', example: '123 Main Street, City, Country' },
        openHour: { type: 'string', example: '09:00' },
        closeHour: { type: 'string', example: '22:00' },
        rank: { type: 'integer', example: 1 },
        priceRange: { type: 'integer', example: 2, description: 'Price range (1-5)' },
        isPromotion: { type: 'boolean', example: true, description: 'Has promotion' },
        promoRate: { type: 'integer', example: 15, description: 'Promotion rate (%)' },
        categoryIds: { type: 'string', example: '1,2,3', description: 'Comma-separated category IDs' },
        countryIds: { type: 'string', example: 'uuid1,uuid2', description: 'Comma-separated country UUIDs' },
        cuisineIds: { type: 'string', example: '1,2,3', description: 'Comma-separated cuisine IDs' },
        socialLink: { type: 'string', example: '{"facebook":"www.facebook.com/restaurant"}' }
      },
      required: ['name', 'description', 'map', 'address', 'openHour', 'closeHour']
    }
  })
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Check if categoryIds is a string and convert it to number[] if necessary
    if (typeof createRestaurantDto.categoryIds === 'string') {
      createRestaurantDto.categoryIds = createRestaurantDto.categoryIds.split(',').map(id => parseInt(id.trim(), 10));
    }
    
    return this.restaurantsService.create(createRestaurantDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Return all restaurants', type: PaginatedRestaurantResponseDto })
  async findAll(@Query() paginationDto: PaginationDto): Promise<ApiResponseInterface<Restaurant[]>> {
    const { results, pagination } = await this.restaurantsService.findAll(
      paginationDto.page,
      paginationDto.limit
    );
    return {
      data: results,
      pagination,
      message: 'Restaurants retrieved successfully'
    };
  }
  
  @Get('by-category')
  @ApiOperation({ summary: 'Get restaurants by category IDs' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Return filtered restaurants', type: PaginatedRestaurantResponseDto })
  async findByCategory(
    @Query() filterDto: FilterRestaurantDto,
    @Query() paginationDto: PaginationDto
  ): Promise<ApiResponseInterface<Restaurant[]>> {
    const { results, pagination } = await this.restaurantsService.findByCategories(
      filterDto.categoryIds || [],
      paginationDto.page,
      paginationDto.limit
    );
    return {
      data: results,
      pagination,
      message: 'Restaurants retrieved successfully'
    };
  }

  @Get('by-country-category')
  @ApiOperation({ summary: 'Get restaurants by both country and category IDs' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Return filtered restaurants', type: PaginatedRestaurantResponseDto })
  async findByCountryAndCategory(
    @Query() filterDto: FilterRestaurantDto,
    @Query() paginationDto: PaginationDto
  ): Promise<ApiResponseInterface<Restaurant[]>> {
    const { results, pagination } = await this.restaurantsService.findByCountryAndCategory(
      filterDto.countryIds || [],
      filterDto.categoryIds || [],
      paginationDto.page,
      paginationDto.limit
    );
    return {
      data: results,
      pagination,
      message: 'Restaurants retrieved successfully'
    };
  }

  @Get('by-country-cuisines')
  @ApiOperation({ summary: 'Get restaurants by both country and cuisine IDs' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Return filtered restaurants', type: PaginatedRestaurantResponseDto })
  async findByCountryAndCuisine(
    @Query() filterDto: FilterRestaurantDto,
    @Query() paginationDto: PaginationDto
  ): Promise<ApiResponseInterface<Restaurant[]>> {
    const { results, pagination } = await this.restaurantsService.findByCountryAndCuisine(
      filterDto.countryIds || [],
      filterDto.cuisineIds || [],
      paginationDto.page,
      paginationDto.limit
    );
    return {
      data: results,
      pagination,
      message: 'Restaurants retrieved successfully'
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Return restaurant by ID', type: SingleRestaurantResponseDto })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseInterface<Restaurant>> {
    const restaurant = await this.restaurantsService.findOne(id);
    return {
      data: restaurant,
      message: 'Restaurant retrieved successfully'
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully', type: SingleRestaurantResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Restaurant Name' },
        description: { type: 'string', example: 'A detailed description of the restaurant' },
        img: { type: 'string', format: 'binary', description: 'Restaurant image' },
        map: { type: 'string', example: 'https://maps.google.com/...' },
        address: { type: 'string', example: '123 Main Street, City, Country' },
        openHour: { type: 'string', example: '09:00' },
        closeHour: { type: 'string', example: '22:00' },
        rank: { type: 'integer', example: 1 },
        priceRange: { type: 'integer', example: 2, description: 'Price range (1-5)' },
        isPromotion: { type: 'boolean', example: true, description: 'Has promotion' },
        promoRate: { type: 'integer', example: 15, description: 'Promotion rate (%)' },
        categoryIds: { type: 'string', example: '1,2,3', description: 'Comma-separated category IDs' },
        countryIds: { type: 'string', example: 'uuid1,uuid2', description: 'Comma-separated country UUIDs' },
        cuisineIds: { type: 'string', example: '1,2,3', description: 'Comma-separated cuisine IDs' },
        socialLink: { type: 'string', example: '{"facebook":"www.facebook.com/restaurant"}' }
      }
    }
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponseInterface<Restaurant>> {
    if (typeof updateRestaurantDto.categoryIds === 'string') {
      updateRestaurantDto.categoryIds = updateRestaurantDto.categoryIds
        .split(',')
        .map(id => parseInt(id.trim(), 10));
    }
  
    if (typeof updateRestaurantDto.countryIds === 'string') {
      updateRestaurantDto.countryIds = updateRestaurantDto.countryIds
        .split(',')
        .map(id => id.trim());
    }

    if (typeof updateRestaurantDto.cuisineIds === 'string') {
      updateRestaurantDto.cuisineIds = updateRestaurantDto.cuisineIds
        .split(',')
        .map(id => parseInt(id.trim(), 10));
    }
  
    const restaurant = await this.restaurantsService.update(id, updateRestaurantDto, file);
    return {
      data: restaurant,
      message: 'Restaurant updated successfully'
    };
  }
  

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseInterface<any>> {
    await this.restaurantsService.remove(id);
    return {
      data: null,
      message: 'Restaurant deleted successfully'
    };
  }
}
