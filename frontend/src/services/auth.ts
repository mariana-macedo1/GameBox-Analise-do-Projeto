import type { AuthResponse, User } from "../types";
import { request } from "./api";

export const authService = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register/", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login/", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<void>("/auth/logout/", { method: "POST" }),
  me: () => request<User>("/auth/me/"),
};
