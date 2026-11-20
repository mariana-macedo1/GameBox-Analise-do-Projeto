import type { GameInput } from "../types";

export type Errors = Record<string, string>;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string): Errors {
  const e: Errors = {};
  if (!emailRe.test(email)) e.email = "Informe um e-mail válido.";
  if (!password) e.password = "Informe a senha.";
  return e;
}

export function validateRegister(name: string, email: string, password: string): Errors {
  const e: Errors = {};
  if (name.trim().length < 2) e.name = "Informe seu nome.";
  if (!emailRe.test(email)) e.email = "Informe um e-mail válido.";
  if (password.length < 6) e.password = "A senha deve ter pelo menos 6 caracteres.";
  return e;
}

export function validateReview(rating: number): Errors {
  return rating >= 1 && rating <= 5 ? {} : { rating: "Selecione uma nota de 1 a 5 estrelas." };
}

export function validateGame(g: GameInput): Errors {
  const e: Errors = {};
  if (!g.title.trim()) e.title = "Informe o nome do jogo.";
  if (!g.genre.trim()) e.genre = "Informe o gênero.";
  if (!g.developer.trim()) e.developer = "Informe a desenvolvedora.";
  if (!Number.isInteger(g.release_year) || g.release_year < 1950 || g.release_year > 2100)
    e.release_year = "Informe um ano entre 1950 e 2100.";
  if (!g.synopsis.trim()) e.synopsis = "Informe a sinopse.";
  if (g.cover_url && !/^https?:\/\/.+/i.test(g.cover_url)) e.cover_url = "Informe uma URL válida (http/https).";
  return e;
}
