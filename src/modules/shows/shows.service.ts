import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { MoviesService } from '../movies/movies.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShowsService {
  constructor(
    private prisma: PrismaService,
    private moviesService: MoviesService,
  ) {}

  async create(createShowDto: CreateShowDto, userId: string) {
    // Check if user can manage this movie
    const canManage = await this.moviesService.canUserManageMovie(createShowDto.movieId, userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to create shows for this movie');
    }

    return this.prisma.show.create({
      data: {
        timestamp: new Date(createShowDto.timestamp),
        screen: createShowDto.screen,
        theatre: createShowDto.theatre,
        theatreData: createShowDto.theatreData,
        movieId: createShowDto.movieId,
        // distributorId: createShowDto.distributorId,
        seatCategories: {
          create: createShowDto.seatCategories.map(cat => ({
            category: cat.category,
            booked: cat.booked,
            price: cat.price,
          })),
        },
      },
      include: {
        seatCategories: true,
      },
    });
  }

  async findAll(userId: string) {
    // Get all movies user can manage
    const allShows = await this.prisma.show.findMany({
      include: {
        seatCategories: true,
      },
    });

    // Filter shows based on movies the user can manage
    const userShows: typeof allShows = [];
    for (const show of allShows) {
      const canManage = await this.moviesService.canUserManageMovie(show.movieId, userId);
      if (canManage) {
        userShows.push(show);
      }
    }
    return userShows;
  }

  async findOne(id: string, userId: string) {
    const show = await this.prisma.show.findUnique({
      where: { id },
      include: {
        seatCategories: true,
      },
    });

    if (!show) {
      throw new NotFoundException(`Show with ID ${id} not found`);
    }

    const canManage = await this.moviesService.canUserManageMovie(show.movieId, userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to view this show');
    }

    return show;
  }

  async update(id: string, updateShowDto: UpdateShowDto, userId: string) {
    const show = await this.prisma.show.findUnique({
      where: { id },
    });

    if (!show) {
      throw new NotFoundException(`Show with ID ${id} not found`);
    }

    const canManage = await this.moviesService.canUserManageMovie(show.movieId, userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to update this show');
    }

    // If seat categories are being updated, delete old ones and create new ones
    if (updateShowDto.seatCategories) {
      await this.prisma.seatCategory.deleteMany({
        where: { showId: id },
      });
    }

    return this.prisma.show.update({
      where: { id },
      data: {
        ...(updateShowDto.timestamp && { timestamp: new Date(updateShowDto.timestamp) }),
        ...(updateShowDto.screen && { screen: updateShowDto.screen }),
        ...(updateShowDto.theatre && { theatre: updateShowDto.theatre }),
        ...(updateShowDto.theatreData && { theatreData: updateShowDto.theatreData }),
        ...(updateShowDto.movieId && { movieId: updateShowDto.movieId }),
        // ...(updateShowDto.distributorId && { distributorId: updateShowDto.distributorId }),
        ...(updateShowDto.seatCategories && {
          seatCategories: {
            create: updateShowDto.seatCategories.map(cat => ({
              category: cat.category,
              booked: cat.booked,
              price: cat.price,
            })),
          },
        }),
      },
      include: {
        seatCategories: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const show = await this.prisma.show.findUnique({
      where: { id },
    });

    if (!show) {
      throw new NotFoundException(`Show with ID ${id} not found`);
    }

    const canManage = await this.moviesService.canUserManageMovie(show.movieId, userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to delete this show');
    }

    return this.prisma.show.delete({
      where: { id },
    });
  }

  async findByMovie(movieId: string, userId: string) {
    const canManage = await this.moviesService.canUserManageMovie(movieId, userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to view shows for this movie');
    }

    return this.prisma.show.findMany({
      where: { movieId },
      include: {
        seatCategories: true,
      },
    });
  }
}
