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

  async create(createRestaurantDto: CreateRestaurantDto, file: Express.Multer.File) {
    // Handle image upload
    const filePath = this.getFilePath(file);

    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      img: filePath,
    });

    return this.restaurantRepository.save(restaurant);
  }

  async findAll() {
    return this.restaurantRepository.find({
      relations: ['categories', 'countries'],
    });
  }

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

    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

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