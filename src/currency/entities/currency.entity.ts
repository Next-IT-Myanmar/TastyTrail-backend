import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  buy: number;

  @Column()
  buyStatus: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  sell: number;

  @Column()
  sellStatus: boolean;
}