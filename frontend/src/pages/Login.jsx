import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../components/providers/UserProvider";
import { loginUser as loginUserApi } from "../api/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
      if (e.target.name === "email") {
        setEmail(e.target.value);
      } else if (e.target.name === "password") {
        setPassword(e.target.value);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await loginUserApi(email, password);
      if (data.success) {
        setSuccess("Login successful!");
        if (data.data && data.data.user) {
          loginUser(data.data.user);
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />
        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          required
        />
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
      </form>

      <div className="auth-foot">
        Don't have an account? <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default Login;
