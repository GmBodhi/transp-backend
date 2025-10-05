import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TheatersService } from './theaters.service';
import { AddTheatersDto } from './dto/add-theaters.dto';

@ApiTags('Theaters')
@Controller('api/movies/:movieId/distributors/:distributorId/theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all theaters for a distributor' })
  @ApiResponse({ status: 200, description: 'Return all theaters' })
  @ApiResponse({ status: 404, description: 'Distributor not found' })
  findByDistributor(
    @Param('movieId') movieId: string,
    @Param('distributorId') distributorId: string,
  ) {
    return this.theatersService.findByDistributor(movieId, distributorId);
  }

  @Post()
  @ApiOperation({ summary: 'Add theaters to a distributor' })
  @ApiResponse({ status: 201, description: 'Theaters added successfully' })
  @ApiResponse({ status: 404, description: 'Distributor not found' })
  addTheaters(
    @Param('movieId') movieId: string,
    @Param('distributorId') distributorId: string,
    @Body() addTheatersDto: AddTheatersDto,
  ) {
    return this.theatersService.addTheaters(movieId, distributorId, addTheatersDto);
  }

  @Delete(':theaterId')
  @ApiOperation({ summary: 'Remove theater from distributor' })
  @ApiResponse({ status: 200, description: 'Theater removed successfully' })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  remove(
    @Param('movieId') movieId: string,
    @Param('distributorId') distributorId: string,
    @Param('theaterId') theaterId: string,
  ) {
    return this.theatersService.remove(movieId, distributorId, theaterId);
  }
}
