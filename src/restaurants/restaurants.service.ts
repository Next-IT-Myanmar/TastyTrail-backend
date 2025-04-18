import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    let { categoryIds } = createRestaurantDto; // Extract categoryIds from DTO

    // Convert categoryIds to number[] if it's a string or string[]
    categoryIds = this.convertCategoryIds(categoryIds);

    // Handle image upload
    const filePath = this.getFilePath(file);

    // Get categories based on the provided IDs
    const categories = await this.categoryRepository.findByIds(categoryIds || []);

    // If some category IDs are invalid, throw an error
    if (categoryIds && categoryIds.length !== categories.length) {
      throw new BadRequestException('Some of the category IDs are invalid.');
    }

    // Create restaurant entity
    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      img: filePath,
      categories, // Assign categories to the restaurant
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

    // Handle image upload if new file is provided
    if (file) {
      // Delete old image
      if (restaurant.img && fs.existsSync(restaurant.img)) {
        fs.unlinkSync(restaurant.img);
      }

      // Save new image
      const filePath = this.getFilePath(file);
      Object.assign(updateRestaurantDto, { img: filePath });
    }

    // Update categories if provided
    if (updateRestaurantDto.categoryIds) {
      // Convert categoryIds to number[] if it's a string or string[]
      const categoryIds = this.convertCategoryIds(updateRestaurantDto.categoryIds);

      // Get categories based on the provided IDs
      const categories = await this.categoryRepository.findByIds(categoryIds);

      // If some category IDs are invalid, throw an error
      if (categoryIds.length !== categories.length) {
        throw new BadRequestException('Some of the category IDs are invalid.');
      }

      Object.assign(updateRestaurantDto, { categories });
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
