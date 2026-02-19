import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../apis/api.js';
import { useAuth } from '../components/providers/AuthProvider.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: '',
    fullName: '',
    password: '',
    desc: '',
    role: '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await createUser(form);
      const created = res?.data ?? null;
      if (created) {
        setUser(created);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Signup</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input name="fullName" placeholder="Full name" value={form.fullName} onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <input name="role" placeholder="Role" value={form.role} onChange={onChange} />
        <textarea name="desc" placeholder="Description" value={form.desc} onChange={onChange} />
        <button type="submit" disabled={loading} className="btn">
          {loading ? (<><span className="loader"/> Signing...</>) : 'Sign up'}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
