import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './entities/restaurant.entity';
import { Category } from '../categories/entities/category.entity';
import { Country } from '../countries/entities/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Category, Country]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}