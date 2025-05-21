import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Newsletter {
  @ApiProperty({
    description: 'The unique identifier of the newsletter subscription',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The email address for the newsletter subscription',
    example: 'subscriber@example.com'
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The date when the subscription was created',
    example: '2024-01-20T10:00:00Z'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the subscription was last updated',
    example: '2024-01-20T15:30:00Z'
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}