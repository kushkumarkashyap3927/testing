
import React, { useState, useEffect } from "react";
import { getAllUsers } from "../api/api";
import { User, Mail, FileText, Cpu, Rocket } from "lucide-react";
import "../App.css";
import "./Home.css";

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAllUsers();
        if (data && data.success) {
          setUsers(data.data?.users || []);
        } else {
          setError(data?.message || "Failed to fetch users");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page-container">
      <header className="hero">
        <div>
          <h1 className="brand">Anvaya.ai <span className="muted">BRD Generator</span></h1>
          <p className="lead">Turn ideas into professional Business Requirement Documents instantly with AI.</p>
          <div className="hero-features">
            <div className="feature"><Cpu size={18} /> AI-driven templates</div>
            <div className="feature"><FileText size={18} /> Export to DOCX/PDF</div>
            <div className="feature"><Rocket size={18} /> Fast, polished output</div>
          </div>
        </div>
        <div className="hero-cta">
          <button className="btn primary">Try BRD Generator</button>
          <button className="btn outline">Learn More</button>
        </div>
      </header>

      <section className="section">
        <h2 className="section-title">All Users</h2>
        {loading && <p className="status">Loading users…</p>}
        {error && <p className="status error">{error}</p>}

        <div className="cards-grid">
          {users.map((user) => (
            <article key={user._id} className="user-card">
              <div className="avatar">{user.fullName?.split(" ").map(n => n[0]).slice(0,2).join("")}</div>
              <div className="user-body">
                <div className="user-row">
                  <h3 className="user-name">{user.fullName}</h3>
                  {user.role && <span className="tag">{user.role}</span>}
                </div>
                <p className="user-desc">{user.desc || "No description provided."}</p>
                <div className="user-meta">
                  <div><Mail size={14} /> <a href={`mailto:${user.email}`}>{user.email}</a></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
