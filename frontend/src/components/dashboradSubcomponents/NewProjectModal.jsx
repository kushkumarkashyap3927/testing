import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';
import { createProject } from '../../apis/api';

export default function NewProjectModal({ open = true, onClose = () => {} }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ projectName: '', project_description: '' });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const userId = user?._id || user?.id || user?.userId;
    if (!userId) return console.error('No user id available');

    setLoading(true);
    try {
      const payload = { userId, projectName: form.projectName, project_description: form.project_description };
      const resp = await createProject(payload);
      // backend returns { statusCode, data, message, success }
      const project = resp?.data ?? resp;
      if (project) {
        const projectId = project.id || project._id || project.projectId;
        onClose();
        navigate(`/project/${projectId}`);
      }
    } catch (err) {
      console.error('Failed to create project', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 z-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create New Project</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="text-sm text-gray-700">Project name</label>
          <input
            name="projectName"
            value={form.projectName}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <label className="text-sm text-gray-700">Description</label>
          <textarea
            name="project_description"
            value={form.project_description}
            onChange={onChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <div className="mt-3 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border text-gray-700">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
