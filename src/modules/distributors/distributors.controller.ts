import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DistributorsService } from './distributors.service';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '../../auth/interfaces/user.interface';

@ApiTags('Distributors')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/movies/:movieId/distributors')
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new distributor for a movie' })
  @ApiResponse({ status: 201, description: 'Distributor created successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  create(
    @Param('movieId') movieId: string,
    @Body() createDistributorDto: CreateDistributorDto,
    @CurrentUser() user: User,
  ) {
    return this.distributorsService.create(movieId, createDistributorDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all distributors for a movie' })
  @ApiResponse({ status: 200, description: 'Return all distributors' })
  findByMovie(@Param('movieId') movieId: string, @CurrentUser() user: User) {
    return this.distributorsService.findByMovie(movieId, user.id);
  }

  @Delete(':distributorId')
  @ApiOperation({ summary: 'Delete a distributor' })
  @ApiResponse({ status: 200, description: 'Distributor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Distributor not found' })
  remove(
    @Param('movieId') movieId: string,
    @Param('distributorId') distributorId: string,
    @CurrentUser() user: User,
  ) {
    return this.distributorsService.remove(movieId, distributorId, user.id);
  }
}
