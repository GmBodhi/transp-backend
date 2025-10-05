import { CreateSeatCategoryDto } from './create-show.dto';

export class UpdateShowDto {
  timestamp?: Date;
  screen?: string;
  theatre?: string;
  theatreData?: Record<string, any>;
  movieId?: string;
  // distributorId?: string;
  seatCategories?: CreateSeatCategoryDto[];
}
