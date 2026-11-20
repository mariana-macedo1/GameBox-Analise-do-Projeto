import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { gameService } from "../services/games";
import type { Game } from "../types";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { gameService.genres().then(setGenres).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      gameService.list(search, genre)
        .then((g) => { setGames(g); setError(""); })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search, genre]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Descubra, avalie e compartilhe <span>seus jogos favoritos</span></h1>
          <p className="muted">A comunidade GameBoxe reúne notas e opiniões sobre os maiores títulos.</p>
          <input className="search" type="search" placeholder="Pesquisar jogo pelo nome…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </section>

      <section className="container">
        <div className="chips">
          <button className={`chip ${genre === "" ? "active" : ""}`} onClick={() => setGenre("")}>Todos</button>
          {genres.map((g) => (
            <button key={g} className={`chip ${genre === g ? "active" : ""}`} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}
        {loading ? <p className="muted">Carregando…</p> : games.length === 0 ? (
          <p className="muted">Nenhum jogo encontrado.</p>
        ) : (
          <div className="grid">{games.map((g) => <GameCard key={g.id} game={g} />)}</div>
        )}
      </section>
    </>
  );
}
