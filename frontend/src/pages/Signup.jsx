import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/api";
import "./Signup.css";

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    desc: "",
    role: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await signupUser(form);
      if (data.success) {
        setSuccess("Signup successful!");
        setForm({ email: "", fullName: "", desc: "", role: "", password: "" });
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Signup</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="auth-input"
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          className="auth-input"
          type="text"
          name="desc"
          placeholder="Description"
          value={form.desc}
          onChange={handleChange}
        />
        <input
          className="auth-input"
          type="text"
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
        />
        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
      </form>

      <div className="auth-foot">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
