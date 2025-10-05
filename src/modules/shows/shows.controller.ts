import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '../../auth/interfaces/user.interface';

@Controller('api/shows')
@UseGuards(AuthGuard)
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Post()
  create(@Body() createShowDto: CreateShowDto, @CurrentUser() user: User) {
    return this.showsService.create(createShowDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.showsService.findAll(user.id);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId') movieId: string, @CurrentUser() user: User) {
    return this.showsService.findByMovie(movieId, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.showsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto, @CurrentUser() user: User) {
    return this.showsService.update(id, updateShowDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.showsService.remove(id, user.id);
  }
}
