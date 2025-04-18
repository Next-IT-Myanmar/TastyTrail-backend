import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Category } from '../categories/entities/category.entity';
import { Country } from '../countries/entities/country.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  private getFilePath(file: Express.Multer.File): string {
    return file.path.replace(/\\/g, '/');
  }

  // Utility function to convert categoryIds to number[] if it's a string or string[]
  private convertCategoryIds(categoryIds: string | string[] | number[]): number[] {
    if (typeof categoryIds === 'string') {
      return categoryIds.split(',').map(id => parseInt(id.trim(), 10));
    } else if (Array.isArray(categoryIds)) {
      return categoryIds.map(id => (typeof id === 'string' ? parseInt(id, 10) : id));
    }
    return categoryIds;
  }

  // Create Restaurant and link categories
  async create(createRestaurantDto: CreateRestaurantDto, file: Express.Multer.File) {
    let { categoryIds, countryIds } = createRestaurantDto;
  
    // Convert categoryIds to number[]
    categoryIds = this.convertCategoryIds(categoryIds);
  
    // Convert countryIds to string[]
    if (typeof countryIds === 'string') {
      countryIds = countryIds.split(',').map(id => id.trim());
    }
  
    // Handle image upload
    const filePath = this.getFilePath(file);
  
    // Get categories
    const categories = await this.categoryRepository.findByIds(categoryIds || []);
    if (categoryIds && categoryIds.length !== categories.length) {
      throw new BadRequestException('Some of the category IDs are invalid.');
    }
  
    // Get countries (UUIDs)
    const countries = countryIds?.length
      ? await this.countryRepository.findBy({ id: In(countryIds) })
      : [];
  
    if (countryIds && countryIds.length !== countries.length) {
      throw new BadRequestException('Some of the country IDs are invalid.');
    }
  
    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      img: filePath,
      categories,
      countries,
    });
  
    return this.restaurantRepository.save(restaurant);
  }
  
  

  // Get all restaurants with their associated categories and countries
  async findAll() {
    return this.restaurantRepository.find({
      relations: ['categories', 'countries'],
    });
  }

  // Get a specific restaurant by ID, including categories and countries
  async findOne(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['categories', 'countries'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  // Update a restaurant, optionally updating the image and categories
  async update(id: string, updateRestaurantDto: UpdateRestaurantDto, file?: Express.Multer.File) {
    const restaurant = await this.findOne(id);
  
    if (file) {
      if (restaurant.img && fs.existsSync(restaurant.img)) {
        fs.unlinkSync(restaurant.img);
      }
      const filePath = this.getFilePath(file);
      Object.assign(updateRestaurantDto, { img: filePath });
    }
  
    // Update categories
    if (updateRestaurantDto.categoryIds) {
      const categoryIds = this.convertCategoryIds(updateRestaurantDto.categoryIds);
      const categories = await this.categoryRepository.findByIds(categoryIds);
  
      if (categoryIds.length !== categories.length) {
        throw new BadRequestException('Some of the category IDs are invalid.');
      }
  
      Object.assign(updateRestaurantDto, { categories });
    }
  
    // Update countries
    if (updateRestaurantDto.countryIds) {
      let countryIds: string[];
    
      if (typeof updateRestaurantDto.countryIds === 'string') {
        countryIds = updateRestaurantDto.countryIds.split(',').map(id => id.trim());
      } else {
        countryIds = updateRestaurantDto.countryIds;
      }
    
      const countries = await this.countryRepository.findBy({ id: In(countryIds) });
    
      if (countryIds.length !== countries.length) {
        throw new BadRequestException('Some of the country IDs are invalid.');
      }
    
      Object.assign(updateRestaurantDto, { countries });
    }
    
  
    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }
  

  // Delete a restaurant and its associated image
  async remove(id: string) {
    const restaurant = await this.findOne(id);

    // Delete restaurant image if it exists
    if (restaurant.img) {
      const imagePath = path.join(process.cwd(), restaurant.img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.restaurantRepository.remove(restaurant);
    return { message: 'Restaurant deleted successfully' };
  }
}
