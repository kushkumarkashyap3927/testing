import React from 'react';
import { FiArrowLeft, FiUser, FiShield, FiBriefcase, FiCheckCircle } from 'react-icons/fi';

export default function PreviewStep1({ result, onBack }) {
    // Handling both direct array or the wrapper object provided in your JSON
    const stakeholders = Array.isArray(result) ? result : result?.data || [];

    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden p-6 animate-in fade-in duration-500">
            
            {/* 1. Header: Navigation and Stats */}
            <div className="flex items-center justify-between mb-8">
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
                            Lineage Verified // {stakeholders.length} Entities Found
                        </p>
                    </div>
                </div>

                <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        Neural_Result_v1
                    </span>
                </div>
            </div>

            {/* 2. The Stakeholder Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {stakeholders.map((person, index) => (
                        <div 
                            key={person.id || index}
                            className="group p-5 bg-slate-50/50 border border-slate-200/60 rounded-[2rem] hover:bg-white hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                {/* Avatar Icon */}
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm">
                                    {person.role.toLowerCase().includes('security') || person.role.toLowerCase().includes('officer') 
                                        ? <FiShield size={20} /> 
                                        : <FiUser size={20} />
                                    }
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                            {person.name}
                                        </h4>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase">
                                            ID_{person.id.slice(-4)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiBriefcase className="text-indigo-500 text-[10px]" />
                                        <p className="text-xs font-bold text-slate-500 italic">
                                            {person.role}
                                        </p>
                                    </div>

                                    {/* System Metrics (Placeholders for Influence/Stance) */}
                                    <div className="flex gap-2">
                                        <div className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                            Inf: {person.influence || 'PENDING'}
                                        </div>
                                        <div className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                            Stance: {person.stance || 'NEUTRAL'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Blueprint Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-slate-200/20 to-transparent pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Global Footer Texture */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                <span>Anvaya_Logic_Lineage_Verified</span>
                <span>Deterministic_Extraction_Result</span>
            </div>

            {/* Background Texture Consistency */}
            <div className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
        </div>
    );
}