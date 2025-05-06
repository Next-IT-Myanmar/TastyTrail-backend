import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}
  create(createCurrencyDto: CreateCurrencyDto, file?: Express.Multer.File) {
const currency = this.currencyRepository.create(createCurrencyDto);
    
    if (file) {
      // Set the image path in the database
      currency.img = `uploads/currency/${file.filename}`;
    }  
    return this.currencyRepository.save(currency);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [results, total] = await this.currencyRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
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
    const currency = await this.currencyRepository.findOne({ where: { id } });
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    return currency;
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto, file?: Express.Multer.File) {
    const currency = await this.findOne(id);  
    // If a new image is uploaded, delete the old one and update the path
    if (file) {
      if (currency.img) {
        const oldImagePath = path.join(process.cwd(), currency.img);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          // Ignore error if file doesn't exist or can't be deleted
          console.error(`Error deleting old image: ${error.message}`);
        }
      }  
      // Set the new image path
      currency.img = `uploads/currency/${file.filename}`;
    }
  
    // Update other fields
    Object.assign(currency, updateCurrencyDto);   
    return this.currencyRepository.save(currency);
  }

  async remove(id: number) {
    const currency = await this.findOne(id); 
    // Delete image file if exists
    if (currency.img) {
      const imagePath = path.join(process.cwd(), currency.img);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        // Ignore error if file doesn't exist or can't be deleted
        console.error(`Error deleting image: ${error.message}`);
      }
    }
    return this.currencyRepository.remove(currency);
  }
  async search(keyword?: string, page: number = 1, limit: number = 10) {
    // Search for currencies where code contains the keyword (case insensitive) if provided
    // Otherwise, return all currencies with pagination
    const whereCondition = keyword ? { code: ILike(`%${keyword}%`) } : {};
    const [results, total] = await this.currencyRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
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