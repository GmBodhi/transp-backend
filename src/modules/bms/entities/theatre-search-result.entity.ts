import { ApiProperty } from '@nestjs/swagger';

export class TheatreSearchResultEntity {
  @ApiProperty({ description: 'Raw search results from BookMyShow' })
  results: any[];

  @ApiProperty({ description: 'Search query used' })
  query: string;

  @ApiProperty({ description: 'Number of results found' })
  count: number;
}
