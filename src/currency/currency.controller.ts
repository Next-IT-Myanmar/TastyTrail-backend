import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new currency rate' })
  @ApiResponse({ status: 201, description: 'The currency has been successfully created.', type: Currency })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
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
  @ApiOperation({ summary: 'Update a currency rate' })
  @ApiResponse({ status: 200, description: 'The currency has been successfully updated.', type: Currency })
  @ApiResponse({ status: 404, description: 'Currency rate not found.' })
  update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currencyService.update(+id, updateCurrencyDto);
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