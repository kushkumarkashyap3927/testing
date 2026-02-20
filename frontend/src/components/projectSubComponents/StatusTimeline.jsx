import React from 'react';
import { Check, Loader2, Circle } from 'lucide-react';

export default function StatusTimeline({ status = 0, loading = false }) {
  const steps = [
    'Initialized',
    'Stakeholders',
    'Atomic Facts',
    'Conflict Resolution',
    'Truth Synthesis',
    'Export Ready',
  ];

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 font-medium animate-pulse">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Engine processing data lineage...</span>
      </div>
    );
  }

  const currentStep = typeof status === 'number' ? status : 0;

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between items-start">
        {/* Background Connector Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 -z-10" />
        
        {steps.map((label, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isPending = i > currentStep;

          return (
            <div key={label} className="flex flex-col items-center flex-1 group">
              {/* Node Icon Container */}
              <div 
                className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 border-2 
                ${isCompleted ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200' : ''}
                ${isCurrent ? 'bg-white border-indigo-600 ring-4 ring-indigo-50 scale-110' : ''}
                ${isPending ? 'bg-white border-slate-200 text-slate-400' : ''}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse" />
                ) : (
                  <span className="text-xs font-bold font-mono">{i + 1}</span>
                )}
              </div>

              {/* Label Text */}
              <div className="mt-3 px-2 text-center">
                <p className={`text-[11px] uppercase tracking-wider font-bold transition-colors duration-300
                  ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                  {label}
                </p>
                {isCurrent && (
                  <span className="text-[9px] text-indigo-400 font-medium animate-pulse">ACTIVE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}