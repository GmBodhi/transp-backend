import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SearchTheatreDto {
  @ApiProperty({
    description: 'Search query for theatres',
    example: 'reva'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  query: string;
}
