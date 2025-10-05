import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto, userId: string) {
    return this.prisma.movie.create({
      data: {
        name: createMovieDto.name,
        director: createMovieDto.director,
        releaseDate: new Date(createMovieDto.releaseDate),
        genre: createMovieDto.genre,
        description: createMovieDto.description,
        language: createMovieDto.language,
        duration: createMovieDto.duration,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.movie.findMany({
      where: { userId },
      include: {
        distributors: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { id, userId },
      include: {
        distributors: {
          include: {
            theatres: true,
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, userId: string) {
    await this.findOne(id, userId); // Check if exists and belongs to user

    return this.prisma.movie.update({
      where: { id },
      data: {
        ...(updateMovieDto.name && { name: updateMovieDto.name }),
        ...(updateMovieDto.director && { director: updateMovieDto.director }),
        ...(updateMovieDto.releaseDate && {
          releaseDate: new Date(updateMovieDto.releaseDate),
        }),
        ...(updateMovieDto.genre && { genre: updateMovieDto.genre }),
        ...(updateMovieDto.description !== undefined && {
          description: updateMovieDto.description,
        }),
        ...(updateMovieDto.language !== undefined && {
          language: updateMovieDto.language,
        }),
        ...(updateMovieDto.duration !== undefined && {
          duration: updateMovieDto.duration,
        }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check if exists and belongs to user

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
