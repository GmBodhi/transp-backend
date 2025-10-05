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
      // where: { userId },
      include: {
        distributors: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const movie = await this.prisma.movie.findFirst({
      // where: { id, userId },
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

  async assignStaffByEmail(movieId: string, staffEmail: string, userId: string) {
    const movie = await this.findOne(movieId, userId);

    // Check if staff user exists and has STAFF role
    const staffUser = await this.prisma.user.findUnique({
      where: { email: staffEmail },
    });

    if (!staffUser) {
      throw new NotFoundException(`Staff user with email ${staffEmail} not found`);
    }

    if (!staffUser.roles.includes('STAFF')) {
      throw new NotFoundException(`User with email ${staffEmail} is not a staff member`);
    }

    // Check if already assigned
    if (movie.assignedStaff.includes(staffUser.id)) {
      return { message: 'Staff already assigned to this movie' };
    }

    return this.prisma.movie.update({
      where: { id: movieId },
      data: {
        assignedStaff: {
          push: staffUser.id,
        },
      },
    });
  }

  async removeStaffByEmail(movieId: string, staffEmail: string, userId: string) {
    const movie = await this.findOne(movieId, userId);

    // Find staff user by email
    const staffUser = await this.prisma.user.findUnique({
      where: { email: staffEmail },
    });

    if (!staffUser) {
      throw new NotFoundException(`Staff user with email ${staffEmail} not found`);
    }

    if (!movie.assignedStaff.includes(staffUser.id)) {
      throw new NotFoundException(`Staff with email ${staffEmail} is not assigned to this movie`);
    }

    return this.prisma.movie.update({
      where: { id: movieId },
      data: {
        assignedStaff: movie.assignedStaff.filter(id => id !== staffUser.id),
      },
    });
  }

  async getAssignedStaff(movieId: string, userId: string) {
    const movie = await this.findOne(movieId, userId);

    const staff = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
      },
    });

    return staff;
  }

  async canUserManageMovie(movieId: string, userId: string): Promise<boolean> {
    return true;
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });



    // if (!movie) {
    //   return false;
    // }

    // // Owner can always manage
    // if (movie.userId === userId) {
    //   return true;
    // }

    // // Assigned staff can manage
    // return movie.assignedStaff.includes(userId);
  }
}
