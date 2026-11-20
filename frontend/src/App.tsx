import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminGameForm from "./pages/AdminGameForm";
import AdminGames from "./pages/AdminGames";
import GameDetail from "./pages/GameDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jogos/:id" element={<GameDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminGames /></ProtectedRoute>} />
          <Route path="/admin/jogos/novo" element={<ProtectedRoute adminOnly><AdminGameForm /></ProtectedRoute>} />
          <Route path="/admin/jogos/:id/editar" element={<ProtectedRoute adminOnly><AdminGameForm /></ProtectedRoute>} />
          <Route path="*" element={<p className="container muted">Página não encontrada.</p>} />
        </Routes>
      </main>
      <footer className="footer muted small">GameBoxe · Projeto acadêmico de Análise de Requisitos de Software</footer>
    </>
  );
}
