import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import * as fs from 'fs';
import { unlink } from 'fs/promises';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  private getFilePath(file: Express.Multer.File): string {
    return file.path.replace(/\\/g, '/');
  }

  async create(createCountryDto: CreateCountryDto, flagFile: Express.Multer.File): Promise<Country> {
    const { flag, name, ...countryData } = createCountryDto;

    const existingCountry = await this.countryRepository.findOne({ where: { name } });
    if (existingCountry) {
      throw new ConflictException(`Country with name ${name} already exists`);
    }

    const country = this.countryRepository.create({ name, ...countryData });
    
    if (flagFile) {
      country.flag = this.getFilePath(flagFile);
    }

    return this.countryRepository.save(country);
  }

  async findAll(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async update(id: string, updateCountryDto: UpdateCountryDto, flagFile?: Express.Multer.File): Promise<Country> {
    const country = await this.findOne(id);
    const { flag, ...countryData } = updateCountryDto;
    
    if (flagFile) {
      // Delete old flag file
      if (country.flag) {
        try {
          await unlink(country.flag);
        } catch (error) {
          // Ignore error if file doesn't exist
        }
      }
      country.flag = this.getFilePath(flagFile);
    }

    Object.assign(country, updateCountryDto);
    return this.countryRepository.save(country);
  }

  async remove(id: string): Promise<void> {
    const country = await this.findOne(id);
    
    // Delete flag file
    try {
      if (country.flag && fs.existsSync(country.flag)) {
        await unlink(country.flag);
      }
    } catch (error) {
      // Ignore error if file doesn't exist
    }

    await this.countryRepository.remove(country);
  }
}