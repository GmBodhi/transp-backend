import { ApiProperty } from '@nestjs/swagger';

export class SearchCategoryEntity {
  @ApiProperty({ example: 'Movies' })
  name: string;

  @ApiProperty({ example: 'MT' })
  type: string;
}

export class MetaEntity {
  @ApiProperty({ example: 5 })
  time: number;

  @ApiProperty({ type: [SearchCategoryEntity] })
  srch_cat: SearchCategoryEntity[];

  @ApiProperty({ example: '' })
  ti: string;
}

export class VenueHitEntity {
  @ApiProperty({ example: 'NS' })
  ST: string;

  @ApiProperty({ example: 'ASLC' })
  CC: string;

  @ApiProperty({ example: 'Venue' })
  GRP: string;

  @ApiProperty({ example: 'Ariesplex SL Cinemas Cinionic Dolby Atmos' })
  GROUP_TITLE: string;

  @ApiProperty({ example: '' })
  L_URL: string;

  @ApiProperty({ example: '' })
  WEB_REDIRECT_URL: string;

  @ApiProperty({ example: '' })
  REGION_SLUG: string;

  @ApiProperty({ example: 'TRIV' })
  REGION: string;

  @ApiProperty({ example: 'ariesplex-sl-cinemas-cinionic-dolby-atmos' })
  SLUG: string;

  @ApiProperty({ example: 'Ariesplex SL Cinemas Cinionic Dolby Atmos' })
  TITLE: string;

  @ApiProperty({ example: 'ASLC' })
  ID: string;

  @ApiProperty({ example: '|MT' })
  TYPE: string;

  @ApiProperty({ example: 'Venues' })
  TYPE_NAME: string;

  @ApiProperty({ example: 'VN' })
  CAT: string;

  @ApiProperty({ example: false })
  IS_STREAM: boolean;

  @ApiProperty({ example: false })
  IS_ONLINE: boolean;

  @ApiProperty({ example: false })
  IS_NLP_RESPONSE: boolean;

  @ApiProperty({ example: '' })
  TAG_TEXT: string;

  @ApiProperty({ example: '' })
  RATINGS_META_URL: string;

  @ApiProperty({
    example:
      'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/--portrait.jpg',
  })
  POSTER_URL: string;
}

export class HitsMetaEntity {
  @ApiProperty({ example: 'Showing 8 results for "aries"' })
  text: string;

  @ApiProperty({ example: '' })
  image: string;

  @ApiProperty({ example: '10000' })
  docHitCount: string;
}

export class BMSSearchResponseEntity {
  @ApiProperty({ type: MetaEntity })
  meta: MetaEntity;

  @ApiProperty({ type: [VenueHitEntity] })
  hits: VenueHitEntity[];

  @ApiProperty({ type: [Object], example: [] })
  extras: any[];

  @ApiProperty({ type: HitsMetaEntity })
  hitsMeta: HitsMetaEntity;
}
