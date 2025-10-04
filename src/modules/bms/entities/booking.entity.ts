import { ApiProperty } from '@nestjs/swagger';

export class BookingEntity {
  @ApiProperty({ description: 'Booking ID' })
  id: string;

  @ApiProperty({ description: 'Movie ID' })
  movieId: string;

  @ApiProperty({ description: 'Theatre ID' })
  theatreId: string;

  @ApiProperty({ description: 'Show date and time' })
  showTime: Date;

  @ApiProperty({ description: 'Number of seats' })
  seats: number;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;
}
