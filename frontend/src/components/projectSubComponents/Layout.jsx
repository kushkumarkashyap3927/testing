import React, { useState, useEffect } from 'react';
import ProjectSidebar from './ProjectSidebar';
import StatusTimeline from './StatusTimeline';
import { Link, useParams } from 'react-router-dom';
import { getProjectById } from '../../apis/api';
import { FiMenu, FiX, FiLayers, FiArrowLeft } from 'react-icons/fi';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    getProjectById(id)
      .then((res) => {
        const data = res?.data ?? res;
        if (mounted) setProject(data);
      })
      .catch((err) => console.error('Layout Sync Error:', err))
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      {/* --- TOP NAVIGATION --- */}
      <header className="fixed inset-x-0 top-0 h-16 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-350 mx-auto h-full px-6 flex items-center justify-between">
          
          {/* Left: Interactive Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <FiLayers className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-tighter">System / Workspace</span>
            </div>
          </div>

          {/* Center: Branding & Project Identity */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-0.5">Anvaya Logic Engine</span>
            <h1 className="text-sm font-black text-slate-800 tracking-tight">
              {loading ? 'Reconciling Data...' : (project?.projectName || 'New Workspace')}
            </h1>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              BACK TO DASHBOARD
            </Link>
          </div>
        </div>
      </header>

      {/* --- SIDEBAR DRAWER --- */}
      <div className={`fixed inset-0 z-60 transition-all duration-500 ${open ? 'visible' : 'pointer-events-none'}`}>
        <div 
          onClick={() => setOpen(false)} 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} 
        />

        <aside className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-out border-r border-slate-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-50">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Context Selector</span>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
              <ProjectSidebar compact project={project} onClose={() => setOpen(false)} />
          </div>
        </aside>
      </div>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <div className="pt-16">
        {/* Sub-header for Timeline */}
        <div className="bg-white border-b border-slate-200/60 sticky top-16 z-20">
          <div className="max-w-300 mx-auto px-6 py-2">
            <StatusTimeline status={project?.status} loading={loading} />
          </div>
        </div>

        {/* Main Content Body */}
        <main className="max-w-300 mx-auto p-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
}