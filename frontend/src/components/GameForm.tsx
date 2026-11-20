import { FormEvent, useState } from "react";
import type { GameInput } from "../types";
import { Errors, validateGame } from "../utils/validation";
import Field from "./Field";

const empty: GameInput = { title: "", genre: "", developer: "", release_year: new Date().getFullYear(), synopsis: "", cover_url: "" };

interface Props {
  initial?: GameInput;
  submitLabel: string;
  onSubmit: (data: GameInput) => Promise<void>;
}

export default function GameForm({ initial = empty, submitLabel, onSubmit }: Props) {
  const [data, setData] = useState<GameInput>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof GameInput>(key: K, value: GameInput[K]) => setData((d) => ({ ...d, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateGame(data);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true); setServerError("");
    try { await onSubmit(data); } catch (err) { setServerError((err as Error).message); } finally { setSaving(false); }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <Field label="Nome" error={errors.title}><input value={data.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <div className="grid-2">
        <Field label="Gênero" error={errors.genre}><input value={data.genre} onChange={(e) => set("genre", e.target.value)} /></Field>
        <Field label="Ano de lançamento" error={errors.release_year}>
          <input type="number" value={data.release_year} onChange={(e) => set("release_year", Number(e.target.value))} />
        </Field>
      </div>
      <Field label="Desenvolvedora" error={errors.developer}><input value={data.developer} onChange={(e) => set("developer", e.target.value)} /></Field>
      <Field label="Imagem de capa (URL, opcional)" error={errors.cover_url}>
        <input placeholder="https://..." value={data.cover_url} onChange={(e) => set("cover_url", e.target.value)} />
      </Field>
      <Field label="Sinopse" error={errors.synopsis}><textarea rows={5} value={data.synopsis} onChange={(e) => set("synopsis", e.target.value)} /></Field>
      {serverError && <p className="error">{serverError}</p>}
      <button className="btn btn-primary" disabled={saving}>{saving ? "Salvando…" : submitLabel}</button>
    </form>
  );
}
