import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Movie ID' })
  @IsUUID()
  @IsNotEmpty()
  movieId: string;

  @ApiProperty({ description: 'Theatre ID' })
  @IsUUID()
  @IsNotEmpty()
  theatreId: string;

  @ApiProperty({ description: 'Show date and time' })
  @IsDateString()
  @IsNotEmpty()
  showTime: string;

  @ApiProperty({ description: 'Number of seats' })
  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
