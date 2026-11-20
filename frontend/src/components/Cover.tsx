import { useState } from "react";
import type { Game } from "../types";

function hue(text: string) {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

/** Mostra a capa; se não houver imagem (ou falhar), gera uma capa em gradiente com o título. */
export default function Cover({ game }: { game: Pick<Game, "title" | "cover_url"> }) {
  const [failed, setFailed] = useState(false);
  if (game.cover_url && !failed) {
    return <img className="cover" src={game.cover_url} alt={`Capa de ${game.title}`} onError={() => setFailed(true)} />;
  }
  const h = hue(game.title);
  return (
    <div className="cover cover-fallback"
      style={{ background: `linear-gradient(145deg, hsl(${h} 60% 38%), hsl(${(h + 60) % 360} 55% 14%))` }}>
      <span>{game.title}</span>
    </div>
  );
}
