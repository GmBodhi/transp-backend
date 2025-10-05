import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDistributorDto } from './dto/create-distributor.dto';

@Injectable()
export class DistributorsService {
  constructor(private prisma: PrismaService) {}

  async create(movieId: string, createDistributorDto: CreateDistributorDto, userId: string) {
    // Verify movie exists and belongs to user
    const movie = await this.prisma.movie.findFirst({
      where: { id: movieId, userId }
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    return this.prisma.distributor.create({
      data: {
        name: createDistributorDto.name,
        tax: createDistributorDto.tax,
        commission: createDistributorDto.commission,
        movieId,
      },
    });
  }

  async findByMovie(movieId: string, userId: string) {
    // Verify movie belongs to user
    const movie = await this.prisma.movie.findFirst({
      where: { id: movieId, userId }
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    return this.prisma.distributor.findMany({
      where: { movieId },
    });
  }

  async remove(movieId: string, distributorId: string, userId: string) {
    // Verify movie belongs to user
    const movie = await this.prisma.movie.findFirst({
      where: { id: movieId, userId }
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const distributor = await this.prisma.distributor.findFirst({
      where: {
        id: distributorId,
        movieId,
      },
    });

    if (!distributor) {
      throw new NotFoundException(`Distributor with ID ${distributorId} not found for movie ${movieId}`);
    }

    return this.prisma.distributor.delete({
      where: { id: distributorId },
    });
  }
}
