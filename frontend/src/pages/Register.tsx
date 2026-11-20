import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { Errors, validateRegister } from "../utils/validation";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateRegister(name, email, password);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try { await register(name, email, password); navigate("/"); } catch (err) { setServerError((err as Error).message); }
  }

  return (
    <div className="container narrow">
      <h1>Criar conta</h1>
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Field label="Nome" error={errors.name}><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="E-mail" error={errors.email}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Senha (mín. 6 caracteres)" error={errors.password}><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {serverError && <p className="error">{serverError}</p>}
        <button className="btn btn-primary">Cadastrar</button>
        <p className="muted small">Já tem conta? <Link to="/login">Entrar</Link></p>
      </form>
    </div>
  );
}
