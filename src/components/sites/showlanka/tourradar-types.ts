export const TOURRADAR_OPERATOR_URL = "https://www.tourradar.com/o/showlanka-tours";
export const TOURRADAR_REVIEWS_URL = `${TOURRADAR_OPERATOR_URL}#reviews`;
export const TOURRADAR_WRITE_REVIEW_URL = "https://www.tourradar.com/review#7578-134495";

export interface TourRadarReview {
  id: string;
  author: string;
  avatar: string | null;
  date: string;
  rating: number;
  tourTitle: string;
  tourUrl: string;
  text: string;
}

export interface TourRadarSummary {
  rating: number;
  reviewCount: number;
  reviews: TourRadarReview[];
}
