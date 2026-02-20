import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function ProjectCard({ project }) {
  const name = project?.projectName || project?.name || project?.title || 'Untitled Project';
  const desc = project?.project_description || project?.description || project?.desc || '';
  const sources = Array.isArray(project?.included_messaging_source) ? project.included_messaging_source : project?.included_messaging_source ? [project.included_messaging_source] : [];
  const files = Array.isArray(project?.files) ? project.files : project?.files ? [project.files] : [];
  const statusMap = { 1: 'Active', 2: 'Archived' };
  const statusLabel = project?.status === 0 ? 'Just initialised' : (statusMap[project?.status] ?? (typeof project?.status === 'number' ? `Status ${project.status}` : 'Unknown'));
  const navigate = useNavigate();

  const projectId = project?.id || project?._id || project?.projectId;

  const goToProject = () => {
    if (!projectId) return;
    navigate(`/project/${projectId}`);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goToProject}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToProject(); }}
      className="relative bg-white rounded-lg p-4 shadow hover:shadow-lg border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
      aria-label={`Open project ${name}`}
    >
      {project?.status === 0 ? (
        <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-semibold">New</span>
      ) : null}
      <header className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
          <div className="mt-1 text-xs text-gray-500">{statusLabel}</div>
        </div>
      </header>

      {desc ? <p className="mt-3 text-sm text-gray-600">{desc}</p> : null}

      <div className="mt-3 text-sm text-gray-600">
        <div><strong className="text-gray-800">Sources:</strong> {sources.length ? sources.join(', ') : '—'}</div>
        <div className="mt-1"><strong className="text-gray-800">Files:</strong> {files.length ? files.join(', ') : '—'}</div>
      </div>
    </article>
  );
}
