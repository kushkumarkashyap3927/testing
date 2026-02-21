import React, { useState, useContext } from 'react';
import { mapStakeholders } from '../../../../apis/api';
import PreviewStep1 from '../preview/PreviewStep1';
import { FiPlay, FiUsers, FiCpu, FiCheckCircle, FiLoader, FiEye, FiActivity } from 'react-icons/fi';
import { useProject } from '../../../providers/ProjectProvider';
import { useAuth } from '../../../providers/AuthProvider';

export default function Step1({ project}) {
    const [preview, setPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const { testUser } = useAuth();
    const [status, setStatus] = useState('idle'); // idle | analyzing | complete
    const [error, setError] = useState(null);
    const { fetchProject } = useProject();
    const [result, setResult] = useState(null);

    const handleProceed = async () => {
        setError(null);
        setLoading(true);
        setStatus('analyzing');
            try {
            // Use workspace-level chats if provided, otherwise fall back to project-level chats
            const relevantChats = testUser;
            const resp = await mapStakeholders(project?.id, relevantChats);
            // API returns created stakeholders or updated project; try to read stakeholders
            const stakeholders = resp?.stakeholders ?? resp?.data ?? (resp || []);
            setResult(stakeholders);
            setStatus('complete');
        } catch (err) {
            setError(String(err));
            setStatus('idle');
        } finally {
            setLoading(false);
        }
    };

    if (preview && result) {
        return (
            <PreviewStep1
                result={result}
                projectId={project?.id}
                onBack={() => setPreview(false)}
                onIncrementSuccess={async () => {
                    // Refresh project and update UI when backend advances status
                    const updated = await fetchProject(project?.id);
                    setResult(updated?.stakeholders ?? []);
                    setStatus('complete');
                    setPreview(false);
                }}
            />
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white p-8 relative overflow-hidden">
            
            <div className="max-w-md w-full flex flex-col items-center text-center z-10">
                
                {/* 1. Dynamic Icon State */}
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-2xl 
                    ${status === 'idle' ? 'bg-slate-900 text-white' : 
                      status === 'complete' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white animate-pulse'}`}>
                    {status === 'idle' && <FiUsers size={32} />}
                    {(status === 'analyzing' || status === 'extracting') && <FiCpu size={32} className="animate-spin" style={{ animationDuration: '3s' }} />}
                    {status === 'complete' && <FiCheckCircle size={32} />}
                </div>

                {/* 2. Textual Status Engine */}
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">
                        {status === 'idle' && "Stakeholder Discovery"}
                        {status === 'analyzing' && "Neural Analysis"}
                        {status === 'extracting' && "Extracting Entities"}
                        {status === 'complete' && "Lineage Verified"}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {status === 'idle' && "Ready to parse project communication logs"}
                        {status === 'analyzing' && "Contextualizing data-vault fragments..."}
                        {status === 'extracting' && "Mapping organizational authority flow..."}
                        {status === 'complete' && `Successfully identified ${result?.length || 0} stakeholders`}
                    </p>
                </div>

                {/* 3. Action / Toggle Button */}
                <div className="flex flex-col items-center gap-6 w-full">
                    {status !== 'complete' ? (
                        <button
                            onClick={handleProceed}
                            disabled={loading}
                            className="group relative px-12 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                        >
                            <span className="flex items-center gap-3">
                                {loading ? <FiLoader className="animate-spin" /> : <FiPlay />}
                                {loading ? 'Analyzing, extracting stakeholders...' : 'Proceed'}
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setPreview(true)}
                            className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all animate-in zoom-in-95"
                        >
                            <FiEye size={16} /> Show Stakeholder Cards
                        </button>
                    )}

                    {/* Simple Activity Indicator */}
                    <div className="flex items-center gap-2">
                        <FiActivity className={`text-xs ${loading ? 'text-indigo-500 animate-pulse' : 'text-slate-200'}`} />
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            Anvaya_Engine_v3.1
                        </span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute bottom-10 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-bold uppercase">
                    Error: {error}
                </div>
            )}

            {/* Background Texture Consistency */}
            <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
        </div>
    );
}