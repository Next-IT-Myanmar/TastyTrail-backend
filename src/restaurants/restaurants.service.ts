import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Category } from '../categories/entities/category.entity';
import { Country } from '../countries/entities/country.entity';
import { Cuisine } from '../cuisines/entities/cuisine.entity'; 
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';
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
    @InjectRepository(Cuisine)
    private cuisineRepository: Repository<Cuisine>,
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

  // Utility function to convert cuisineIds to number[] if it's a string or string[]
  private convertCuisineIds(cuisineIds: string | string[] | number[]): number[] {
    if (typeof cuisineIds === 'string') {
      return cuisineIds.split(',').map(id => parseInt(id.trim(), 10));
    } else if (Array.isArray(cuisineIds)) {
      return cuisineIds.map(id => (typeof id === 'string' ? parseInt(id, 10) : id));
    }
    return cuisineIds;
  }

  // Create Restaurant and link categories, countries, and cuisines
  async create(createRestaurantDto: CreateRestaurantDto, file: Express.Multer.File, otherPhotoFiles?: Express.Multer.File[]) {
    let { categoryIds, countryIds, cuisineIds } = createRestaurantDto;
  
    // Convert categoryIds to number[]
    categoryIds = this.convertCategoryIds(categoryIds);
  
    // Convert cuisineIds to number[]
    cuisineIds = this.convertCuisineIds(cuisineIds);
  
    // Convert countryIds to string[]
    if (typeof countryIds === 'string') {
      countryIds = countryIds.split(',').map(id => id.trim());
    }
  
    // Handle main image upload
    const filePath = this.getFilePath(file);

    // Handle other photos upload
    let otherPhotoFilePaths: string[] = [];
    if (otherPhotoFiles && otherPhotoFiles.length > 0) {
      otherPhotoFilePaths = otherPhotoFiles.map(file => this.getFilePath(file));
    }
  
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

    // Get cuisines
    const cuisines = await this.cuisineRepository.findByIds(cuisineIds || []);
    if (cuisineIds && cuisineIds.length !== cuisines.length) {
      throw new BadRequestException('Some of the cuisine IDs are invalid.');
    }
  
    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      img: filePath,
      otherPhoto: otherPhotoFilePaths,
      categories,
      countries,
      cuisines
    });
  
    // Save the restaurant and return it with relations loaded
    const savedRestaurant = await this.restaurantRepository.save(restaurant);
    
    // Get the restaurant with relations loaded
    const restaurantWithRelations = await this.restaurantRepository.findOne({
      where: { id: savedRestaurant.id },
      relations: ['categories', 'countries', 'cuisines']
    });

    // Add the IDs to the response
    return {
      ...restaurantWithRelations,
      categoryIds: categoryIds || [],
      countryIds: countryIds || [],
      cuisineIds: cuisineIds || []
    };
  }
  
  

  // Get all restaurants with their associated categories, countries, and cuisines with pagination
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [results, total] = await this.restaurantRepository.findAndCount({
      relations: ['categories', 'countries', 'cuisines'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      results,
      pagination: {
        page,
        limit,
        total
      }
    };
  }

  // Get restaurants by category IDs with pagination
  async findByCategories(categoryIds: number[], page: number = 1, limit: number = 10) {
    if (!categoryIds || categoryIds.length === 0) {
      return this.findAll(page, limit);
    }

    const skip = (page - 1) * limit;
    const parsedCategoryIds = this.convertCategoryIds(categoryIds);
    
    const [results, total] = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.categories', 'category')
      .leftJoinAndSelect('restaurant.countries', 'country')
      .leftJoinAndSelect('restaurant.cuisines', 'cuisine')
      .where('category.id IN (:...categoryIds)', { categoryIds: parsedCategoryIds })
      .orderBy('restaurant.createdAt', 'DESC')
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

  // Get restaurants by country IDs with pagination
  async findByCountries(countryIds: string[], page: number = 1, limit: number = 10) {
    if (!countryIds || countryIds.length === 0) {
      return this.findAll(page, limit);
    }
    
    const skip = (page - 1) * limit;
    const [results, total] = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.categories', 'category')
      .leftJoinAndSelect('restaurant.countries', 'country')
      .leftJoinAndSelect('restaurant.cuisines', 'cuisine')
      .where('country.id IN (:...countryIds)', { countryIds })
      .orderBy('restaurant.createdAt', 'DESC')
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

  // Search restaurants with keyword and country filter
  async search(searchDto: SearchRestaurantDto) {
    const { keyword, countryId, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.categories', 'category')
      .leftJoinAndSelect('restaurant.countries', 'country')
      .leftJoinAndSelect('restaurant.cuisines', 'cuisine');

    if (keyword) {
      queryBuilder.andWhere(
        '(LOWER(restaurant.name) LIKE LOWER(:keyword) OR ' +
        'LOWER(restaurant.description) LIKE LOWER(:keyword) OR ' +
        'LOWER(category.name) LIKE LOWER(:keyword) OR ' +
        'LOWER(category.description) LIKE LOWER(:keyword) OR ' +
        'LOWER(cuisine.name) LIKE LOWER(:keyword) OR ' +
        'LOWER(cuisine.description) LIKE LOWER(:keyword))',
        { keyword: `%${keyword}%` }
      );
    }

    if (countryId) {
      queryBuilder.andWhere('country.id = :countryId', { countryId });
    }

    const [results, total] = await queryBuilder
      .orderBy('restaurant.createdAt', 'DESC')
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

  // Get restaurants by both country and category IDs with pagination
  async findByCountryAndCategory(countryIds: string[], categoryIds: number[], page: number = 1, limit: number = 10) {
    if ((!countryIds || countryIds.length === 0) && (!categoryIds || categoryIds.length === 0)) {
      return this.findAll(page, limit);
    }

    const skip = (page - 1) * limit;
    const parsedCategoryIds = this.convertCategoryIds(categoryIds);
    
    const queryBuilder = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.categories', 'category')
      .leftJoinAndSelect('restaurant.countries', 'country')
      .leftJoinAndSelect('restaurant.cuisines', 'cuisine');

    if (countryIds && countryIds.length > 0) {
      queryBuilder.andWhere('country.id IN (:...countryIds)', { countryIds });
    }

    if (parsedCategoryIds && parsedCategoryIds.length > 0) {
      queryBuilder.andWhere('category.id IN (:...categoryIds)', { categoryIds: parsedCategoryIds });
    }

    const [results, total] = await queryBuilder
      .orderBy('restaurant.createdAt', 'DESC')
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

  // Get restaurants by both country and cuisine IDs with pagination
  async findByCountryAndCuisine(countryIds: string[], cuisineIds: number[], page: number = 1, limit: number = 10) {
    if ((!countryIds || countryIds.length === 0) && (!cuisineIds || cuisineIds.length === 0)) {
      return this.findAll(page, limit);
    }

    const skip = (page - 1) * limit;
    const parsedCuisineIds = this.convertCuisineIds(cuisineIds);
    
    const queryBuilder = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.categories', 'category')
      .leftJoinAndSelect('restaurant.countries', 'country')
      .leftJoinAndSelect('restaurant.cuisines', 'cuisine');

    if (countryIds && countryIds.length > 0) {
      queryBuilder.andWhere('country.id IN (:...countryIds)', { countryIds });
    }

    if (parsedCuisineIds && parsedCuisineIds.length > 0) {
      queryBuilder.andWhere('cuisine.id IN (:...cuisineIds)', { cuisineIds: parsedCuisineIds });
    }

    const [results, total] = await queryBuilder
      .orderBy('restaurant.createdAt', 'DESC')
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

  // Get a specific restaurant by ID, including categories, countries, and cuisines
  async findOne(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['categories', 'countries', 'cuisines'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  // Update a restaurant, optionally updating the image, other photos, categories, countries, and cuisines
  async update(id: string, updateRestaurantDto: UpdateRestaurantDto, file?: Express.Multer.File, otherPhotoFiles?: Express.Multer.File[]) {
    const restaurant = await this.findOne(id);
  
    if (file) {
      if (restaurant.img && fs.existsSync(restaurant.img)) {
        fs.unlinkSync(restaurant.img);
      }
      const filePath = this.getFilePath(file);
      Object.assign(updateRestaurantDto, { img: filePath });
    }

    // Handle other photos upload
    if (otherPhotoFiles && otherPhotoFiles.length > 0) {
      // Delete existing other photos if they exist
      if (restaurant.otherPhoto && restaurant.otherPhoto.length > 0) {
        restaurant.otherPhoto.forEach(photoPath => {
          if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
          }
        });
      }
      
      const otherPhotoFilePaths = otherPhotoFiles.map(file => this.getFilePath(file));
      Object.assign(updateRestaurantDto, { otherPhoto: otherPhotoFilePaths });
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
    
    // Update cuisines
    if (updateRestaurantDto.cuisineIds) {
      const cuisineIds = this.convertCuisineIds(updateRestaurantDto.cuisineIds);
      const cuisines = await this.cuisineRepository.findByIds(cuisineIds);
  
      if (cuisineIds.length !== cuisines.length) {
        throw new BadRequestException('Some of the cuisine IDs are invalid.');
      }
  
      Object.assign(updateRestaurantDto, { cuisines });
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

    // Delete other photos if they exist
    if (restaurant.otherPhoto && restaurant.otherPhoto.length > 0) {
      restaurant.otherPhoto.forEach(photoPath => {
        const fullPath = path.join(process.cwd(), photoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await this.restaurantRepository.remove(restaurant);
    return { message: 'Restaurant deleted successfully' };
  }
}
