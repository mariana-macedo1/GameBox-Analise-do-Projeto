import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { Errors, validateLogin } from "../utils/validation";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateLogin(email, password);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try { await login(email, password); navigate("/"); } catch (err) { setServerError((err as Error).message); }
  }

  return (
    <div className="container narrow">
      <h1>Entrar</h1>
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Field label="E-mail" error={errors.email}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Senha" error={errors.password}><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {serverError && <p className="error">{serverError}</p>}
        <button className="btn btn-primary">Entrar</button>
        <p className="muted small">Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      </form>
    </div>
  );
}
