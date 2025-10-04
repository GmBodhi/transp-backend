import { ApiProperty } from '@nestjs/swagger';

export class TheatreEntity {
  @ApiProperty({ description: 'Theatre title/name' })
  title: string;

  @ApiProperty({ description: 'Theatre region/location' })
  region: string;

  @ApiProperty({
    description: 'Additional theatre data in JSON format',
    type: 'object',
    additionalProperties: true,
  })
  data?: Record<string, any>;
}
