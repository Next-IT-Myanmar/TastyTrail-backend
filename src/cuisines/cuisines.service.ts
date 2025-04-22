import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuisine } from './entities/cuisine.entity';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';
import { BaseService } from '../common/services/base.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as fs from 'fs';

@Injectable()
export class CuisinesService extends BaseService<Cuisine> {
  constructor(
    @InjectRepository(Cuisine)
    private readonly cuisineRepository: Repository<Cuisine>,
  ) {
    super(cuisineRepository);
  }

  async create(createCuisineDto: CreateCuisineDto, imageFile: Express.Multer.File) {
    const { image, ...cuisineData } = createCuisineDto;
    const cuisine = this.cuisineRepository.create(cuisineData);
    
    if (imageFile) {
      const uploadDir = 'uploads/cuisins';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}-${imageFile.originalname}`;
      const filePath = `${uploadDir}/${uniqueFileName}`;
      fs.writeFileSync(filePath, imageFile.buffer);
      cuisine.image = filePath;
    }

    return this.cuisineRepository.save(cuisine);
  }

  async findAll(paginationDto: PaginationDto) {
    const queryBuilder = this.cuisineRepository.createQueryBuilder('cuisine');
    return this.paginate(queryBuilder, paginationDto);
  }

  async findOne(id: number) {
    const cuisine = await this.cuisineRepository.findOne({ where: { id } });
    if (!cuisine) {
      throw new NotFoundException(`Cuisine with ID ${id} not found`);
    }
    return cuisine;
  }

  async update(id: number, updateCuisineDto: UpdateCuisineDto, imageFile?: Express.Multer.File) {
    const cuisine = await this.findOne(id);

    if (imageFile) {
      // Delete old image if exists
      if (cuisine.image && fs.existsSync(cuisine.image)) {
        fs.unlinkSync(cuisine.image);
      }

      const uploadDir = 'uploads/cuisins';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}-${imageFile.originalname}`;
      const filePath = `${uploadDir}/${uniqueFileName}`;
      fs.writeFileSync(filePath, imageFile.buffer);
      cuisine.image = filePath;
    }

    Object.assign(cuisine, updateCuisineDto);
    return this.cuisineRepository.save(cuisine);
  }

  async remove(id: number) {
    const cuisine = await this.findOne(id);
    
    // Delete image file if exists
    if (cuisine.image && fs.existsSync(cuisine.image)) {
      fs.unlinkSync(cuisine.image);
    }

    await this.cuisineRepository.remove(cuisine);
    return { message: `Cuisine with ID ${id} has been deleted` };
  }
}