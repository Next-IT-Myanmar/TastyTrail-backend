import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Currency {
  @ApiProperty({
    description: 'The unique identifier of the currency',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({
    description: 'The date when the currency was last updated',
    example: '2024-01-20T15:30:00Z'
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({
    description: 'The buy rate of the currency',
    example: 1.25
  })
  @Column('decimal', { precision: 10, scale: 2 })
  buy: number;

  @ApiProperty({
    description: 'The status of buy rate',
    example: true
  })
  @Column()
  buyStatus: boolean;

  @ApiProperty({
    description: 'The sell rate of the currency',
    example: 1.35
  })
  @Column('decimal', { precision: 10, scale: 2 })
  sell: number;

  @ApiProperty({
    description: 'The status of sell rate',
    example: true
  })
  @Column()
  sellStatus: boolean;

  @ApiProperty({
    description: 'The currency code',
    example: 'USD'
  })
  @Column({ nullable: true })
  code: string;

  @ApiProperty({
    description: 'The image URL of the currency',
    example: 'uploads/currency/usd.png'
  })
  @Column({ nullable: true })
  img: string;

  @ApiProperty({
    description: 'The date when the currency was created',
    example: '2024-01-20T10:00:00Z'
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}