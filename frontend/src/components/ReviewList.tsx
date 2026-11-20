import type { Review } from "../types";
import { Stars } from "./StarRating";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return <p className="muted">Este jogo ainda não possui avaliações. Seja o primeiro!</p>;
  return (
    <ul className="review-list">
      {reviews.map((r) => (
        <li key={r.id} className="card review">
          <div className="review-head">
            <strong>{r.user_name}</strong>
            <Stars value={r.rating} size={16} />
            <span className="muted small">{new Date(r.created_at).toLocaleDateString("pt-BR")}</span>
          </div>
          {r.comment && <p>{r.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
