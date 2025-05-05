import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

}