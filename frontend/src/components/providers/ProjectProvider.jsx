import React, { createContext, useCallback, useContext, useState } from 'react';
import { getProjectById } from '../../apis/api';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await getProjectById(id);
      const data = res?.data ?? res;
      setProject(data);
      return data;
    } catch (err) {
      setError(err?.message || 'Failed to fetch project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    project,
    setProject,
    fetchProject,
    loading,
    error,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  return useContext(ProjectContext);
}

export default ProjectProvider;
