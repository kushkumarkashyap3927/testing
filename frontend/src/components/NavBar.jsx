import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from './providers/AuthProvider.jsx';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link to="/" className="brand">
        <Zap size={22} />
        <span>Anvaya.Ai</span>
      </Link>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="link muted">Dashboard</Link>
            <button onClick={() => logout()} className="btn ghost">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="link muted">Login</Link>
            <Link to="/signup" className="btn primary">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
