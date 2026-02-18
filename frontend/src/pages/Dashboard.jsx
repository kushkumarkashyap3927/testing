
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useUser } from "../components/providers/UserProvider";
import { getUserProfile } from "../api/api";
import ProfileCard from "../components/dashboard/ProfileCard";
import ProjectSection from "../components/dashboard/ProjectSection";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail = useMemo(() => user?.email || null, [user?.email]);

  const fetchProfile = useCallback(async () => {
    if (!userEmail) return;
    setLoading(true);
    setError("");
    try {
      const data = await getUserProfile(userEmail);
      if (data.success && data.data && data.data.user) {
        setProfile(data.data.user);
      } else {
        setError(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, [fetchProfile]);


  if(!mounted) return null; // Prevent rendering until mounted to avoid hydration issues

  return (
    <div>
      <h2>Dashboard Page</h2>
      {loading && <p>Loading profile...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="dashboard-container">
        <div className="left-panel">
          <ProfileCard profile={profile || user} />
        </div>

        <div className="right-panel">
          <ProjectSection />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
