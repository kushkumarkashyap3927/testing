
import React, { useState, useEffect } from "react";

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/user/all");
        const data = await response.json();
        if (response.ok && data.success) {
          setUsers(data.data.users);
        } else {
          setError(data.message || "Failed to fetch users");
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
    <div>
      <h2>All Users</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {users.map((user) => (
          <div key={user._id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, minWidth: 220 }}>
            <h4>{user.fullName}</h4>
            <p><b>Email:</b> {user.email}</p>
            {user.desc && <p><b>Description:</b> {user.desc}</p>}
            {user.role && <p><b>Role:</b> {user.role}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
