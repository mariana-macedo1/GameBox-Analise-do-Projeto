import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O proxy encaminha /api para o Django, evitando configurar CORS.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": "http://127.0.0.1:8000" } },
});
