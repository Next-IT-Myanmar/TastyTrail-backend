import { IsEmail, IsNotEmpty, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: ['123e4567-e89b-12d3-a456-426614174000'], description: 'Array of Role IDs to assign to the user' })
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  roleIds: string[];
}