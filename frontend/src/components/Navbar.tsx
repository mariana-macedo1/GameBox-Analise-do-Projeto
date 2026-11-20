import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">🎮 Game<span>Rate</span></Link>
        <nav className="nav-links">
          <NavLink to="/" end>Catálogo</NavLink>
          {user?.is_admin && <NavLink to="/admin">Administração</NavLink>}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <span className="muted">Olá, {user.name.split(" ")[0]}</span>
              <button className="btn btn-ghost" onClick={async () => { await logout(); navigate("/"); }}>Sair</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Entrar</Link>
              <Link className="btn btn-primary" to="/cadastro">Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
