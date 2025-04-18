import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity()
export class Category {
  @ApiProperty({
    description: 'The unique identifier of the category',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'A description of the category',
    example: 'Electronic devices and accessories'
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'The image URL of the category',
    example: 'categories/electronics.jpg'
  })
  @Column()
  img: string;

  @ApiProperty({
    description: 'The date when the category was created',
    example: '2024-01-20T10:00:00Z'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the category was last updated',
    example: '2024-01-20T15:30:00Z'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Restaurants associated with this category',
    type: () => [Restaurant]
  })

  restaurants: Restaurant[];
}