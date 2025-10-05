import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':movieId')
  @ApiOperation({ summary: 'Get analytics for a movie' })
  @ApiResponse({ status: 200, description: 'Return movie analytics' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  getMovieAnalytics(@Param('movieId') movieId: string) {
    return this.analyticsService.getMovieAnalytics(movieId);
  }
}
