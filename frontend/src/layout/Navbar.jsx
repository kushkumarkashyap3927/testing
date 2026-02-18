
import { useUser } from "../components/providers/UserProvider";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(() => navigate("/login"));
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">BRD Generator</span>
      </div>
      <div className="navbar-right">
        {!user && (
          <Link to="/login" className="login-btn">Login</Link>
        )}
        {user && (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
