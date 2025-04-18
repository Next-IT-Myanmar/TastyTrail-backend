import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { FilterByCountryDto } from './dto/filter-by-country.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully', type: Restaurant })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiResponse({ status: 200, description: 'Return all restaurants', type: [Restaurant] })
  findAll() {
    return this.restaurantsService.findAll();
  }
  
  @Get('by-category')
  @ApiOperation({ summary: 'Get restaurants by category IDs' })
  @ApiResponse({ status: 200, description: 'Return filtered restaurants', type: [Restaurant] })
  findByCategory(@Query() filterDto: FilterRestaurantDto) {
    return this.restaurantsService.findByCategories(filterDto.categoryIds || []);
  }

  @Get('by-country')
  @ApiOperation({ summary: 'Get restaurants by country IDs' })
  @ApiResponse({ status: 200, description: 'Return filtered restaurants', type: [Restaurant] })
  findByCountry(@Query() filterDto: FilterByCountryDto) {
    return this.restaurantsService.findByCountries(filterDto.countryIds || []);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
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
  
    return this.restaurantsService.update(id, updateRestaurantDto, file);
  }
  

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.remove(id);
  }
}
