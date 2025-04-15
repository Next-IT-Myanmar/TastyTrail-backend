import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user account',
  })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: false,
  })
  lastName?: string;
}