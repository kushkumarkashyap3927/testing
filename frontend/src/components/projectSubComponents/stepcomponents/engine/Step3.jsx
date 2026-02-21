import React, { useEffect, useState } from 'react';
import { findContradictions } from '../../../../apis/api';
import { useProject } from '../../../providers/ProjectProvider';
import PreviewStep3 from '../preview/PreviewStep3';
import { FiShield, FiSearch, FiLoader, FiCheckCircle, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';

export default function Step3() {
  const [loading, setLoading] = useState(false);
  const { project } = useProject();
  const [error, setError] = useState(null);
  const [contradictions, setContradictions] = useState([]);
  const [preview, setPreview] = useState(false);
  const [result, setResult] = useState(null);

  const load = async (autoPreview = false) => {
    if (!project?.id) return;
    setError(null);
    setLoading(true);
    try {
      const resp = await findContradictions(project.id);
      const items = resp?.data || resp?.savedContradictions || resp?.contradictions || (Array.isArray(resp) ? resp : []);
      
      setContradictions(items);
      setResult(items);
      if (autoPreview && items.length > 0) setPreview(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [project?.id]);

  if (preview && result) {
    return (
      <PreviewStep3
        result={result}
        onBack={() => setPreview(false)}
        projectId={project?.id}
        onIncrementSuccess={async () => {
          await load();
          setPreview(false);
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden p-8 relative">
      
      {/* 1. Industrial Status Header */}
      <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-600 rounded-[1.5rem] flex items-center justify-center shadow-sm">
            <FiShield size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Conflict Hub</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              Logic Audit // Status: Reconciling
            </p>
          </div>
        </div>

        <button
          onClick={() => load(true)}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiSearch />}
          {loading ? 'Scanning Logic...' : 'Execute Logic Audit'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase flex items-center gap-3">
          <FiAlertTriangle /> {error}
        </div>
      )}

      {/* 2. Scrollable Conflict Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {contradictions.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <FiCheckCircle size={48} className="text-slate-200 mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Logic Stream Consistent</p>
          </div>
        ) : (
          contradictions.map((c, idx) => (
            <div 
              key={c.id ?? idx} 
              className="group p-6 bg-slate-50/50 border border-slate-200/60 rounded-[2.5rem] hover:bg-white hover:border-indigo-300 transition-all duration-300 relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-indigo-600 uppercase">
                      ISSUE_REF_{idx + 1}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2 pr-10 leading-relaxed">
                    {c.context || "Unreconciled Logical Drift Detected"}
                  </h4>
                  
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Traceability ID: <span className="text-slate-900">{c.id?.slice(-8) || 'SYSTEM_SNAPSHOT'}</span>
                  </p>
                </div>

                <button 
                  onClick={() => { setResult(contradictions); setPreview(true); }}
                  className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Background Texture Consistency */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
    </div>
  );
}