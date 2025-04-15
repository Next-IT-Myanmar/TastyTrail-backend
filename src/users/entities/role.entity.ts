import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique identifier of the role' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'admin', description: 'Name of the role' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'Administrator role with full access', description: 'Description of the role', required: false })
  @Column({ nullable: true })
  desc: string;

  @ApiProperty({ description: 'Creation timestamp of the role' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp of the role' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => [User], description: 'Users assigned to this role' })
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}