import type { Game, GameInput, Review } from "../types";
import { request } from "./api";

export const gameService = {
  list: (search = "", genre = "") => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (genre) q.set("genre", genre);
    return request<Game[]>(`/games/?${q}`);
  },
  genres: () => request<string[]>("/genres/"),
  get: (id: string | number) => request<Game>(`/games/${id}/`),
  create: (data: GameInput) => request<Game>("/games/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: GameInput) =>
    request<Game>(`/games/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/games/${id}/`, { method: "DELETE" }),
  reviews: (id: string | number) => request<Review[]>(`/games/${id}/reviews/`),
  review: (id: string | number, rating: number, comment: string) =>
    request<Review>(`/games/${id}/reviews/`, { method: "POST", body: JSON.stringify({ rating, comment }) }),
};
