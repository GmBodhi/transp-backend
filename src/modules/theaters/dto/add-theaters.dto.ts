import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTheatersDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  theaterIds: string[];
}
