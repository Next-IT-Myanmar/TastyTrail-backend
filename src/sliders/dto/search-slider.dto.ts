import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchSliderDto extends PaginationDto {
  @ApiProperty({
    description: 'Search keyword for slider title',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}