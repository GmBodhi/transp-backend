import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getMovieAnalytics(movieId: string) {
    // Verify movie exists
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        distributors: {
          include: {
            theatres: true,
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    // Calculate basic stats
    const totalTheaters = movie.distributors.reduce(
      (sum, dist) => sum + dist.theatres.length,
      0,
    );

    // Mock analytics data structure
    // In a real application, this would query actual sales/ticket data
    return {
      stats: {
        totalTickets: 0,
        totalRevenue: 0,
        netProfit: 0,
        activeTheaters: totalTheaters,
      },
      salesTrend: [],
      regionalSales: [],
      showTimingSales: [],
      distributorBreakdown: movie.distributors.map(dist => ({
        name: dist.name,
        value: 0,
      })),
      topTheaters: [],
      allTheaters: movie.distributors.flatMap(dist =>
        dist.theatres.map(theatre => ({
          name: theatre.title || theatre.name || 'Unknown',
          totalSales: 0,
          earnings: 0,
        })),
      ),
    };
  }
}
