export class SeatCategory {
  id: string;
  showId: string;
  category: string; // e.g., 'diamond', 'gold', 'silver'
  booked: number;
  price: number;
}

export class Show {
  id: string;
  timestamp: Date;
  screen: string;
  theatre: string;
  theatreData: Record<string, any>;
  movieId: string;
  seatCategories?: SeatCategory[];
  createdAt: Date;
  updatedAt: Date;
}
