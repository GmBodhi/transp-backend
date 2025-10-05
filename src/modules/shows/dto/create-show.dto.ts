export class CreateSeatCategoryDto {
  category: string;
  total?: number;
  available?: number;
  booked: number;
  price: number;
}

export class CreateShowDto {
  timestamp: Date;
  screen: string;
  theatre: string;
  theatreData: Record<string, any>;
  movieId: string;
  // distributorId: string;
  seatCategories: CreateSeatCategoryDto[];
}
