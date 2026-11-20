import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cover from "../components/Cover";
import ReviewList from "../components/ReviewList";
import { StarInput, Stars } from "../components/StarRating";
import { useAuth } from "../context/AuthContext";
import { gameService } from "../services/games";
import type { Game, Review } from "../types";
import { validateReview } from "../utils/validation";

export default function GameDetail() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const [g, r] = await Promise.all([gameService.get(id), gameService.reviews(id)]);
    setGame(g); setReviews(r);
  }, [id]);

  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);

  const mine = reviews.find((r) => r.user_id === user?.id);
  useEffect(() => { if (mine) { setRating(mine.rating); setComment(mine.comment); } }, [mine?.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess("");
    const errs = validateReview(rating);
    if (errs.rating) { setFormError(errs.rating); return; }
    setFormError(""); setSending(true);
    try {
      await gameService.review(id, rating, comment.trim());
      await load();
      setSuccess("Avaliação enviada com sucesso!");
    } catch (err) { setFormError((err as Error).message); } finally { setSending(false); }
  }

  if (error) return <p className="container error">{error}</p>;
  if (!game) return <p className="container muted">Carregando…</p>;

  return (
    <div className="container">
      <Link to="/" className="muted">← Voltar ao catálogo</Link>
      <div className="detail">
        <Cover game={game} />
        <div>
          <span className="badge">{game.genre}</span>
          <h1>{game.title}</h1>
          <p className="muted">{game.developer} · {game.release_year}</p>
          <div className="rating-line big">
            <Stars value={game.average_rating} size={26} />
            <strong>{game.reviews_count ? game.average_rating.toFixed(1) : "—"}</strong>
            <span className="muted">({game.reviews_count} avaliaç{game.reviews_count === 1 ? "ão" : "ões"})</span>
          </div>
          <h3>Sinopse</h3>
          <p>{game.synopsis}</p>
        </div>
      </div>

      <h2>Sua avaliação</h2>
      {user ? (
        <form className="card form" onSubmit={handleSubmit} noValidate>
          <StarInput value={rating} onChange={setRating} />
          <textarea rows={3} placeholder="Comentário (opcional)" value={comment} onChange={(e) => setComment(e.target.value)} />
          {formError && <p className="error">{formError}</p>}
          {success && <p className="success">{success}</p>}
          <button className="btn btn-primary" disabled={sending}>{mine ? "Atualizar avaliação" : "Enviar avaliação"}</button>
        </form>
      ) : (
        <p className="card form">Para avaliar este jogo, <Link to="/login">entre</Link> ou <Link to="/cadastro">cadastre-se</Link>.</p>
      )}

      <h2>Avaliações da comunidade</h2>
      <ReviewList reviews={reviews} />
    </div>
  );
}
