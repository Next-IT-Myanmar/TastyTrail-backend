import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements Partial<CreateUserDto> {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    required: false,
  })
  email?: string;

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