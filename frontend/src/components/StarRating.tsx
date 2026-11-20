import { useState } from "react";

/** Exibição somente leitura (aceita notas fracionadas, ex.: 3.7). */
export function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value} de 5 estrelas`}>
      <span className="stars-bg">★★★★★</span>
      <span className="stars-fg" style={{ width: `${(value / 5) * 100}%` }}>★★★★★</span>
    </span>
  );
}

/** Seleção interativa de 1 a 5 estrelas. */
export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="star-input" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Nota">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} role="radio" aria-checked={value === n} aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
          className={n <= shown ? "on" : ""} onMouseEnter={() => setHover(n)} onClick={() => onChange(n)}>
          ★
        </button>
      ))}
      <span className="muted">{value ? `${value}/5` : "Selecione"}</span>
    </div>
  );
}
