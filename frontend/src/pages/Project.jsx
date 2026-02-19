import React from "react";
import { useParams } from "react-router-dom";
import './Project.css'

function Project() {
  const { id } = useParams();
  return (
    <div className="project-root">
      <div className="project-card">
        <h2>Project</h2>
        <div className="project-meta">Project ID: {id}</div>
        <p style={{marginTop:12}}>This is a placeholder project view for demo purposes.</p>
      </div>
    </div>
  );
}

export default Project;
