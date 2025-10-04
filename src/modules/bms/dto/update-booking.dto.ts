import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber, IsUUID } from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'Movie ID' })
  @IsUUID()
  @IsOptional()
  movieId?: string;

  @ApiPropertyOptional({ description: 'Theatre ID' })
  @IsUUID()
  @IsOptional()
  theatreId?: string;

  @ApiPropertyOptional({ description: 'Show date and time' })
  @IsDateString()
  @IsOptional()
  showTime?: string;

  @ApiPropertyOptional({ description: 'Number of seats' })
  @IsNumber()
  @IsOptional()
  seats?: number;

  @ApiPropertyOptional({ description: 'User ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
