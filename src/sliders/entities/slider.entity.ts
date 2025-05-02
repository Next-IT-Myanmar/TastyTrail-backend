import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('sliders')
export class Slider {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Main Slider' })
  @Column()
  title: string;

  @ApiProperty({ example: 'This is a description for the slider' })
  @Column()
  description: string;

  @ApiProperty({ example: 'uploads/slider/image.png' })
  @Column()
  image: string;

  @ApiPropertyOptional({ description: 'Creation timestamp of the slider' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp of the slider' })
  @UpdateDateColumn()
  updatedAt: Date;
}