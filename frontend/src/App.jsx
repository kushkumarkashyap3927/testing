import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCpu, FiGitBranch, FiUserCheck, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const features = [
    {
      title: "Stakeholder Mapping",
      desc: "Identifies organizational hierarchy and authority flow using Gemini-powered extraction.",
      icon: <FiUsers className="text-indigo-600" />,
    },
    {
      title: "Contextual Extraction",
      desc: "Atomic Fact mapping with deep-linked citations back to original communication channels.",
      icon: <FiCpu className="text-rose-600" />,
    },
    {
      title: "DAG Conflict Detection",
      desc: "Directed Acyclic Graph logic to identify requirement drift across multi-channel data.",
      icon: <FiGitBranch className="text-amber-600" />,
    },
    {
      title: "HITL Resolution",
      desc: "Mandatory Human-in-the-Loop intervention for resolving high-stakes logic contradictions.",
      icon: <FiUserCheck className="text-emerald-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-24 mt-16">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 p-12 overflow-hidden relative">
          
          {/* Hero Section */}
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Logic-First Requirements Engine</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Deterministic BRD synthesis <br /> 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-rose-600">
                with verified data lineage.
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
              Anvaya.Ai is a Source-of-Truth reconciliation engine designed to transform fragmented business 
              communications into verified Documents. Leveraging <strong>shared Zod contracts</strong> and 
              audit-ready provenance to eliminate requirement drift.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                Launch Workspace <FiArrowRight />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                Member Login
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Blueprint Grid Texture */}
          <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
        </div>
      </main>
    </div>
  );
}