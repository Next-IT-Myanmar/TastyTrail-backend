import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new country' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'United States' },
        description: { type: 'string', example: 'A country in North America' },
        flag: {
          type: 'string',
          format: 'binary',
          description: 'Flag image file (jpg, jpeg, png, or svg)',
        },
      },
      required: ['name', 'flag'],
    },
  })
  @ApiResponse({ status: 201, description: 'Country successfully created', type: Country })
  @UseInterceptors(FileInterceptor('flag', {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  }))
  async create(
    @Body() createCountryDto: CreateCountryDto,
    @UploadedFile() flag: Express.Multer.File,
  ): Promise<Country> {
    return this.countriesService.create(createCountryDto, flag);
  }

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'List of all countries', type: [Country] })
  async findAll(): Promise<Country[]> {
    return this.countriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a country by ID' })
  @ApiResponse({ status: 200, description: 'Country found', type: Country })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Country> {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a country' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'United States' },
        description: { type: 'string', example: 'A country in North America' },
        flag: {
          type: 'string',
          format: 'binary',
          description: 'Flag image file (jpg, jpeg, png, or svg)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Country successfully updated', type: Country })
  @UseInterceptors(FileInterceptor('flag', {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @UploadedFile() flag?: Express.Multer.File,
  ): Promise<Country> {
    return this.countriesService.update(id, updateCountryDto, flag);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a country' })
  @ApiResponse({ status: 200, description: 'Country successfully deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.countriesService.remove(id);
  }
}