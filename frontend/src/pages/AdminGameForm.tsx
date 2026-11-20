import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GameForm from "../components/GameForm";
import { gameService } from "../services/games";
import type { GameInput } from "../types";

export default function AdminGameForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<GameInput | undefined>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    gameService.get(id)
      .then(({ title, genre, developer, release_year, synopsis, cover_url }) =>
        setInitial({ title, genre, developer, release_year, synopsis, cover_url }))
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleSubmit(data: GameInput) {
    if (id) await gameService.update(id, data); else await gameService.create(data);
    navigate("/admin");
  }

  if (error) return <p className="container error">{error}</p>;
  if (id && !initial) return <p className="container muted">Carregando…</p>;

  return (
    <div className="container narrow">
      <h1>{id ? "Editar jogo" : "Novo jogo"}</h1>
      <GameForm initial={initial} submitLabel={id ? "Salvar alterações" : "Cadastrar jogo"} onSubmit={handleSubmit} />
    </div>
  );
}
