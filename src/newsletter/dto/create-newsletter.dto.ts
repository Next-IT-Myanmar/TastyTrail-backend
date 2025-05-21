import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsletterDto {
  @ApiProperty({
    description: 'Email address for newsletter subscription',
    example: 'subscriber@example.com',
    required: true
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}