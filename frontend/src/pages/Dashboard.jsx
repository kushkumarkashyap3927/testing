import React from 'react'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-root">
      <h2>Dashboard</h2>
      <div className="dash-grid">
        <div className="dash-card">
          <h3 className="dash-title">My Projects</h3>
          <div className="dash-small">You have 0 active projects.</div>
        </div>
        <div className="dash-card">
          <h3 className="dash-title">BRD Templates</h3>
          <div className="dash-small">Create, edit and export BRDs quickly.</div>
        </div>
        <div className="dash-card">
          <h3 className="dash-title">Integrations</h3>
          <div className="dash-small">Connect to external tools and storage.</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard