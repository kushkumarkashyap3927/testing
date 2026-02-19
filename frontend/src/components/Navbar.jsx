import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "./providers/UserProvider";

export default function Navbar() {
  const { user, logoutUser } = useUser();

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">Anvaya.ai</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/signup">Signup</Link>}
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && <button className="link-btn" onClick={() => logoutUser()}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}
