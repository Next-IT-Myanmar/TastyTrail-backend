import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes ,ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/currency.entity';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new currency rate',
    description: 'Creates a new currency with optional image upload. The image field should be sent as a file.'})
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'The currency has been successfully created.', type: Currency })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        buy: { type: 'number', example: 1.25, minimum: 0 },
        buyStatus: { type: 'boolean', example: true },
        sell: { type: 'number', example: 1.35, minimum: 0 },
        sellStatus: { type: 'boolean', example: true },
        code: { type: 'string', example: 'USD' },
        img: {
          type: 'string',
          format: 'binary',
          description: 'Currency image file (jpg, jpeg, png, or gif)',
        },
      },
      required: ['buy', 'buyStatus', 'sell', 'sellStatus'],
    },
  })
  @UseInterceptors(FileInterceptor('img', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = './uploads/currency';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  create(
    @Body() createCurrencyDto: CreateCurrencyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.currencyService.create(createCurrencyDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all currency rates with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all currency rates.', type: [Currency] })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.currencyService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a currency rate by id' })
  @ApiResponse({ status: 200, description: 'Return the currency rate.', type: Currency })
  @ApiResponse({ status: 404, description: 'Currency rate not found.' })
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update a currency rate',
    description: 'Updates a currency with optional image upload. The img field should be sent as a file. The code field can be updated as text.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'The currency has been successfully updated.', type: Currency })
  @ApiResponse({ status: 404, description: 'Currency rate not found.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        buy: { type: 'number', example: 1.25, minimum: 0 },
        buyStatus: { type: 'boolean', example: true },
        sell: { type: 'number', example: 1.35, minimum: 0 },
        sellStatus: { type: 'boolean', example: true },
        code: { type: 'string', example: 'USD' },
        img: {
          type: 'string',
          format: 'binary',
          description: 'Currency image file (jpg, jpeg, png, or gif)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('img', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = './uploads/currency';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  update(
    @Param('id') id: string, 
    @Body() updateCurrencyDto: UpdateCurrencyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.currencyService.update(+id, updateCurrencyDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a currency rate' })
  @ApiResponse({ status: 200, description: 'The currency has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Currency rate not found.' })
  remove(@Param('id') id: string) {
    return this.currencyService.remove(+id);
  }
}