import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddTheatersDto } from './dto/add-theaters.dto';

@Injectable()
export class TheatersService {
  constructor(private prisma: PrismaService) {}

  async findByDistributor(movieId: string, distributorId: string) {
    // Verify distributor belongs to movie
    const distributor = await this.prisma.distributor.findFirst({
      where: {
        id: distributorId,
        movieId,
      },
    });

    if (!distributor) {
      throw new NotFoundException(`Distributor with ID ${distributorId} not found for movie ${movieId}`);
    }

    return this.prisma.theatre.findMany({
      where: { distributorId },
    });
  }

  async addTheaters(movieId: string, distributorId: string, addTheatersDto: AddTheatersDto) {
    // Verify distributor belongs to movie
    const distributor = await this.prisma.distributor.findFirst({
      where: {
        id: distributorId,
        movieId,
      },
    });

    if (!distributor) {
      throw new NotFoundException(`Distributor with ID ${distributorId} not found for movie ${movieId}`);
    }

    // Update theaters to link them to this distributor
    await this.prisma.theatre.updateMany({
      where: {
        id: { in: addTheatersDto.theaterIds },
      },
      data: {
        distributorId,
      },
    });

    return this.prisma.theatre.findMany({
      where: {
        id: { in: addTheatersDto.theaterIds },
      },
    });
  }

  async remove(movieId: string, distributorId: string, theaterId: string) {
    const theater = await this.prisma.theatre.findFirst({
      where: {
        id: theaterId,
        distributorId,
        distributor: {
          movieId,
        },
      },
    });

    if (!theater) {
      throw new NotFoundException(`Theater with ID ${theaterId} not found`);
    }

    // Remove distributor link
    return this.prisma.theatre.update({
      where: { id: theaterId },
      data: { distributorId: null },
    });
  }
}
