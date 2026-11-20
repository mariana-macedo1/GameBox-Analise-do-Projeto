export interface User { id: number; name: string; email: string; is_admin: boolean }
export interface Game {
  id: number; title: string; genre: string; developer: string; release_year: number;
  synopsis: string; cover_url: string; average_rating: number; reviews_count: number;
}
export type GameInput = Omit<Game, "id" | "average_rating" | "reviews_count">;
export interface Review {
  id: number; user_id: number; user_name: string; rating: number; comment: string; created_at: string;
}
export interface AuthResponse { token: string; user: User }
