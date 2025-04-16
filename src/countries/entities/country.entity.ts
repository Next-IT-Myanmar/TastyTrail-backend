import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('countries')
export class Country {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique identifier of the country' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'United States', description: 'Name of the country' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'A country in North America', description: 'Description of the country' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 'flag-usa.svg', description: 'Flag image file name of the country' })
  @Column()
  flag: string;

  @ApiProperty({ description: 'Creation timestamp of the country' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp of the country' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Restaurants associated with this country',
    type: () => [Restaurant]
  })
  @ManyToMany(() => Restaurant, restaurant => restaurant.countries)
  restaurants: Restaurant[];
}