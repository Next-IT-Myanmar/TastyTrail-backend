import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cuisine {
  @ApiProperty({
    description: 'The unique identifier of the cuisine',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the cuisine',
    example: 'Italian'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'A description of the cuisine',
    example: 'Traditional Italian dishes and cooking styles'
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'The image URL of the cuisine',
    example: 'cuisines/italian.jpg'
  })
  @Column()
  image: string;

  @ApiProperty({
    description: 'The date when the cuisine was created',
    example: '2024-01-20T10:00:00Z'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the cuisine was last updated',
    example: '2024-01-20T15:30:00Z'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}