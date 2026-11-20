import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gameService } from "../services/games";
import type { Game } from "../types";

export default function AdminGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState("");

  const load = () => gameService.list().then(setGames).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function handleDelete(g: Game) {
    if (!window.confirm(`Excluir "${g.title}"? Suas avaliações também serão removidas.`)) return;
    try { await gameService.remove(g.id); await load(); } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="container">
      <div className="row-between">
        <h1>Gerenciar jogos</h1>
        <Link className="btn btn-primary" to="/admin/jogos/novo">+ Novo jogo</Link>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Jogo</th><th>Gênero</th><th>Ano</th><th>Nota</th><th></th></tr></thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id}>
                <td>{g.title}</td><td>{g.genre}</td><td>{g.release_year}</td>
                <td>{g.reviews_count ? `${g.average_rating.toFixed(1)} ★` : "—"}</td>
                <td className="actions">
                  <Link className="btn btn-ghost" to={`/admin/jogos/${g.id}/editar`}>Editar</Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(g)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
