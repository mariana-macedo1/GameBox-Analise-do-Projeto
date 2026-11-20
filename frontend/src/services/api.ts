const BASE = "/api";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t: string | null) =>
  t ? localStorage.setItem("token", t) : localStorage.removeItem("token");

export class ApiError extends Error {
  constructor(public status: number, public data: unknown) {
    super(extractMessage(data));
  }
}

function extractMessage(data: any): string {
  if (!data) return "Não foi possível conectar ao servidor.";
  if (typeof data.detail === "string") return data.detail;
  if (typeof data === "object") {
    const parts = Object.values(data).map((v) => (Array.isArray(v) ? v[0] : String(v)));
    if (parts.length) return parts.join(" ");
  }
  return "Ocorreu um erro inesperado.";
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Token ${token}`;

  let res: Response;
  try {
    res = await fetch(BASE + path, { ...options, headers });
  } catch {
    throw new ApiError(0, null);
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (res.status === 401) setToken(null); // token inválido/expirado
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}
