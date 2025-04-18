import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { Slider } from './entities/slider.entity';
import * as fs from 'fs';
import * as path from 'path';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads/slider');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [TypeOrmModule.forFeature([Slider])],
  controllers: [SlidersController],
  providers: [SlidersService],
})
export class SlidersModule {}