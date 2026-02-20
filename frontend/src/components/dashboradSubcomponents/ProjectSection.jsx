import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { getProjectsByUserId } from '../../apis/api';
import ProjectCard from './ProjectCard';
import NewProjectModal from './NewProjectModal';

export default function ProjectSection() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = user.id || user._id || user?.userId;
    if (!userId) return;

    let mounted = true;
    setLoading(true);
    getProjectsByUserId(userId)
      .then((res) => {
        // normalize response to an array of projects
        let list = [];
        if (!res) list = [];
        else if (Array.isArray(res)) list = res;
        else if (Array.isArray(res.data)) list = res.data;
        else if (Array.isArray(res.projects)) list = res.projects;
        else if (Array.isArray(res.data?.projects)) list = res.data.projects;
        else if (Array.isArray(res.data?.data)) list = res.data.data;
        else list = [];

        if (mounted) setProjects(list);
      })
      .catch((err) => {
        console.error('Failed to fetch projects', err);
        if (mounted) setProjects([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Projects</h3>
        <button
          onClick={() => setShowNewModal(true)}
          className="ml-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="bg-white/80 p-4 rounded shadow-sm">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="bg-white/80 p-4 rounded shadow-sm">No projects yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id || p._id || p.projectId || p._id?.toString()} project={p} />
          ))}
        </div>
      )}
      <NewProjectModal open={showNewModal} onClose={() => setShowNewModal(false)} />
    </section>
  );
}
