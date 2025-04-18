import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity()
export class Restaurant {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique identifier of the restaurant' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Restaurant Name', description: 'Name of the restaurant' })
  @Column()
  name: string;

  @ApiProperty({ example: 'A detailed description of the restaurant', description: 'Description of the restaurant' })
  @Column('text')
  description: string;

  @ApiProperty({ example: 'restaurant.jpg', description: 'Image of the restaurant' })
  @Column()
  img: string;

  @ApiProperty({ example: 'map-location.jpg', description: 'Map location of the restaurant' })
  @Column()
  map: string;

  @ApiProperty({ example: '123 Main Street', description: 'Physical address of the restaurant' })
  @Column()
  address: string;

  @ApiProperty({ example: '09:00', description: 'Opening hour of the restaurant' })
  @Column('time')
  openHour: string;

  @ApiProperty({ example: '22:00', description: 'Closing hour of the restaurant' })
  @Column('time')
  closeHour: string;

  
  @ApiProperty({ example: 1, description: 'Rank of the restaurant' })
  @Column('int', { default: 0 })
  rank: number;

  @ApiProperty({ description: 'Creation timestamp of the restaurant' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp of the restaurant' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => [Category], description: 'Categories associated with the restaurant' })
  @ManyToMany(() => Category)
  @JoinTable()  // This will create a junction table between Restaurant and Category
  categories: Category[];

  @ApiProperty({ type: () => [Country], description: 'Countries associated with the restaurant' })
  @ManyToMany(() => Country, (country) => country.restaurants)
  @JoinTable()  // This will create a junction table between Restaurant and Country
  countries: Country[];

  @ApiProperty({
    example: {
      facebook: 'www.facebook.com/restaurant',
      whatsapp: 'www.whatsapp.com/restaurant',
      twitter: 'www.twitter.com/restaurant'
    },
    description: 'Social media links of the restaurant'
  })
  @Column('json', { nullable: true })
  socialLink: Record<string, string>;
}