import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './entities/restaurant.entity';
import { Category } from '../categories/entities/category.entity';
import { Country } from '../countries/entities/country.entity';
import { Cuisine } from '../cuisines/entities/cuisine.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Category, Country, Cuisine]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Set different destinations based on field name
          const uploadPath = file.fieldname === 'otherPhoto' 
            ? './uploads/otherPhoto' 
            : './uploads/restaurant';
          
          // Create directory if it doesn't exist
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname); // keeps .jpg, .png, etc.
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
