
import { useUser } from "../components/providers/UserProvider";
import { Link } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  const { user } = useUser();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">BRD Generator</span>
      </div>
      <div className="navbar-right">
        {!user && (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
