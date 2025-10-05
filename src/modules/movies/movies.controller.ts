import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '../../auth/interfaces/user.interface';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  create(@Body() createMovieDto: CreateMovieDto, @CurrentUser() user: User) {
    return this.moviesService.create(createMovieDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'Return all movies' })
  findAll(@CurrentUser() user: User) {
    return this.moviesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'Return the movie' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.moviesService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto, @CurrentUser() user: User) {
    return this.moviesService.update(id, updateMovieDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.moviesService.remove(id, user.id);
  }

  @Post(':id/staff/:staffEmail')
  @ApiOperation({ summary: 'Assign staff to a movie by email' })
  @ApiResponse({ status: 200, description: 'Staff assigned successfully' })
  assignStaff(@Param('id') id: string, @Param('staffEmail') staffEmail: string, @CurrentUser() user: User) {
    return this.moviesService.assignStaffByEmail(id, staffEmail, user.id);
  }

  @Delete(':id/staff/:staffEmail')
  @ApiOperation({ summary: 'Remove staff from a movie by email' })
  @ApiResponse({ status: 200, description: 'Staff removed successfully' })
  removeStaff(@Param('id') id: string, @Param('staffEmail') staffEmail: string, @CurrentUser() user: User) {
    return this.moviesService.removeStaffByEmail(id, staffEmail, user.id);
  }

  @Get(':id/staff')
  @ApiOperation({ summary: 'Get all staff assigned to a movie' })
  @ApiResponse({ status: 200, description: 'Return assigned staff' })
  getAssignedStaff(@Param('id') id: string, @CurrentUser() user: User) {
    return this.moviesService.getAssignedStaff(id, user.id);
  }
}
