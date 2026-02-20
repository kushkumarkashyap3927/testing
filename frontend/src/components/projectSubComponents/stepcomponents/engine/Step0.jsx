import React from 'react';
import { FiSidebar, FiFilePlus, FiAlertTriangle, FiArrowRight, FiActivity } from 'react-icons/fi';

export default function Step0({ project }) {
  return (
    /* FIX: 
      1. h-full + max-h-full: Strictly limits the height to the parent's inner area.
      2. flex-col: Keeps elements stacked.
      3. justify-center: Centers the box even if the parent is very tall.
    */
    <div className="w-full h-full max-h-full flex flex-col items-center justify-center bg-white overflow-hidden p-6 box-border relative">
      
      {/* Main Content Wrapper: 
        Using 'shrink-0' ensures the content doesn't compress or overflow.
      */}
      <div className="max-w-md w-full flex flex-col gap-6 relative z-10 shrink-0">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-xl mb-4">
            <FiFilePlus className="text-2xl" />
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Logic Ingestion
          </h1>
          <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            System Ref: <span className="text-indigo-600">{project?.projectName || 'NULL_REF'}</span>
          </p>
        </div>

        {/* Action Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl group transition-all hover:border-indigo-200">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300">01</span>
              <div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Data Vault Sync</p>
                <p className="text-[10px] text-slate-400 font-medium italic">Toggle chats in sidebar</p>
              </div>
            </div>
            <FiSidebar className="text-slate-300" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl group transition-all hover:border-indigo-200">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300">02</span>
              <div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Source Context</p>
                <p className="text-[10px] text-slate-400 font-medium italic">Upload reference documents</p>
              </div>
            </div>
            <FiFilePlus className="text-slate-300" />
          </div>
        </div>

        {/* Logic Lock Card */}
        <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-3">
            <FiAlertTriangle className="text-indigo-200 mt-0.5" size={16} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-100">Immutability Lock</p>
              <p className="text-[11px] font-medium leading-tight opacity-90 mt-1">
                Ingestion freezes source context to prevent requirement drift.
              </p>
            </div>
          </div>
          <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/5 rounded-full" />
        </div>

       
      </div>

      {/* Grid Texture */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
    </div>
  );
}