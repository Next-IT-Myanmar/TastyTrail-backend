import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuisinesService } from './cuisines.service';
import { CuisinesController } from './cuisines.controller';
import { Cuisine } from './entities/cuisine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuisine])],
  controllers: [CuisinesController],
  providers: [CuisinesService],
  exports: [CuisinesService],
})
export class CuisinesModule {}