import { Link } from "react-router-dom";
import type { Game } from "../types";
import Cover from "./Cover";
import { Stars } from "./StarRating";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link to={`/jogos/${game.id}`} className="card game-card">
      <Cover game={game} />
      <div className="game-card-body">
        <span className="badge">{game.genre}</span>
        <h3>{game.title}</h3>
        <p className="muted small">{game.release_year}</p>
        <div className="rating-line">
          <Stars value={game.average_rating} />
          <strong>{game.reviews_count ? game.average_rating.toFixed(1) : "—"}</strong>
        </div>
      </div>
    </Link>
  );
}
