import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BmsService } from './bms.service';
import { BMSSearchResponseEntity } from './entities/bms-search.entity';

@ApiTags('BMS (Booking Management)')
@Controller('bms')
export class BmsController {
  constructor(private readonly bmsService: BmsService) {}

  @Get('search-theatres')
  @ApiOperation({ summary: 'Search theatres from BookMyShow' })
  @ApiQuery({
    name: 'q',
    description: 'Search query for theatres',
    example: 'reva',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search results from BookMyShow',
    type: BMSSearchResponseEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing query parameter',
  })
  @ApiResponse({ status: 502, description: 'Failed to fetch from BookMyShow' })
  searchTheatres(@Query('q') query: string): Promise<BMSSearchResponseEntity> {
    return this.bmsService.searchTheatres(query);
  }
}
