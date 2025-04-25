import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the role' })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ description: 'Creation timestamp of the role', required: false })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp of the role', required: false })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}