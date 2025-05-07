import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Slider } from './entities/slider.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
  ) {}

  async create(createSliderDto: CreateSliderDto, file: Express.Multer.File) {
    const slider = this.sliderRepository.create({
      ...createSliderDto,
      image: file ? `uploads/slider/${file.filename}` : null,
    });
    return this.sliderRepository.save(slider);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [results, total] = await this.sliderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) {
      throw new NotFoundException(`Slider with ID ${id} not found`);
    }
    return slider;
  }

  async update(id: number, updateSliderDto: UpdateSliderDto, file?: Express.Multer.File) {
    const slider = await this.findOne(id);
    
    if (file) {
      // Delete old image if exists
      if (slider.image) {
        const oldImagePath = path.join(process.cwd(), slider.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      slider.image = `uploads/slider/${file.filename}`;
    }

    Object.assign(slider, updateSliderDto);
    return this.sliderRepository.save(slider);
  }

  async remove(id: number) {
    const slider = await this.findOne(id);
    
    // Delete image file if exists
    if (slider.image) {
      const imagePath = path.join(process.cwd(), slider.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return this.sliderRepository.remove(slider);
  }

  async search(keyword?: string, page: number = 1, limit: number = 10) {
    // Search for sliders where title contains the keyword (case insensitive) if provided
    // Otherwise, return all sliders with pagination
    const whereCondition = keyword ? { title: ILike(`%${keyword}%`) } : {};
    const [results, total] = await this.sliderRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      results,
      pagination: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit)
      }
    };
  }
}