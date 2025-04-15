import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address of the user' })
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Column()
  lastName: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @ApiProperty({ type: () => [Role], description: 'Roles assigned to the user' })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id'
    }
  })
  roles: Role[];

  @ApiProperty({ description: 'Creation timestamp of the user' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp of the user' })
  @UpdateDateColumn()
  updatedAt: Date;
}