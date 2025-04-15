import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, imageFile: Express.Multer.File) {
    const { img, ...categoryData } = createCategoryDto;
    const category = this.categoryRepository.create(categoryData);
    
    if (imageFile) {
      const uploadDir = 'uploads\\categories';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}-${imageFile.originalname}`;
      const filePath = `${uploadDir}\\${uniqueFileName}`;
      fs.writeFileSync(filePath, imageFile.buffer);
      category.img = filePath;
    }

    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, imageFile?: Express.Multer.File) {
    const category = await this.findOne(id);

    if (imageFile) {
      // Delete old image if exists
      if (category.img && fs.existsSync(category.img)) {
        fs.unlinkSync(category.img);
      }

      const uploadDir = 'uploads\\categories';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}-${imageFile.originalname}`;
      const filePath = `${uploadDir}\\${uniqueFileName}`;
      fs.writeFileSync(filePath, imageFile.buffer);
      category.img = filePath;
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    
    // Delete image file if exists
    if (category.img && fs.existsSync(category.img)) {
      fs.unlinkSync(category.img);
    }

    await this.categoryRepository.remove(category);
    return { message: `Category with ID ${id} has been deleted` };
  }
}