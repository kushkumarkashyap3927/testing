import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiUser, FiShield, FiBriefcase, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import { increamentProjectStatus } from '../../../../apis/api';
import { useProject } from '../../../providers/ProjectProvider';

export default function PreviewStep1({ result, onBack, projectId, onIncrementSuccess }) {
    const stakeholders = Array.isArray(result) ? result : result?.data || [];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Access fetchProject from your context provider
    const { fetchProject } = useProject();

    const handleProceed = async () => {
        setError(null);
        setLoading(true);
        try {
            // 1. First, call the DB increment function
            await increamentProjectStatus(projectId);
            
            // 2. On Success, fetch the fresh project data from the server
            // This will update the global 'project' state in your Provider
            await fetchProject(projectId);
            
            // 3. Callback for any local UI cleanup if needed
            if (onIncrementSuccess) onIncrementSuccess();
            
        } catch (err) {
            console.error('Sequence Error:', err);
            setError("Logic Transition Failed: " + (err.message || String(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden p-6 animate-in fade-in duration-500 relative">
            
            {/* Header: Navigation, Stats and Action */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            Extracted Stakeholders
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <FiCheckCircle className="text-emerald-500" /> 
                            {stakeholders.length} Entities Reconciled
                        </p>
                    </div>
                </div>

                {/* The Transition Action */}
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={handleProceed}
                        disabled={loading}
                        className="group flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        {loading ? 'Committing Logic...' : 'Commit & Proceed to Step 2'}
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    {error && <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">{error}</span>}
                </div>
            </div>

            {/* The Stakeholder Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stakeholders.map((person, index) => (
                        <div 
                            key={person.id || index}
                            className="group p-5 bg-slate-50/50 border border-slate-200/60 rounded-[2rem] hover:bg-white hover:border-indigo-300 transition-all duration-300 relative"
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all">
                                    {person.role.toLowerCase().includes('security') || person.role.toLowerCase().includes('ceo') 
                                        ? <FiShield size={20} /> 
                                        : <FiUser size={20} />
                                    }
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                            {person.name}
                                        </h4>
                                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                            person.influence === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {person.influence || 'Standard'}
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs font-bold text-slate-500 italic flex items-center gap-2">
                                        <FiBriefcase className="text-indigo-500 text-[10px]" />
                                        {person.role}
                                    </p>

                                    <div className="flex gap-2 mt-4">
                                        <div className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-tighter shadow-sm">
                                            Stance: <span className="text-slate-600">{person.stance || 'Neutral'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Blueprint Background */}
            <div className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
        </div>
    );
}