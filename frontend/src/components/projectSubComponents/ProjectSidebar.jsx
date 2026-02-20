import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { FiMail, FiMessageCircle, FiCalendar, FiDatabase, FiPlus, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { SiSlack } from 'react-icons/si';

export default function ProjectSidebar({ compact = false, project = null }) {
  const { testUser } = useAuth();
  const channelsOfInterest = ['gmail', 'whatsapp', 'slack', 'meetings'];

  const [channelVisible, setChannelVisible] = useState(() => 
    channelsOfInterest.reduce((acc, c) => { acc[c] = true; return acc; }, {})
  );
  const [threadRelevance, setThreadRelevance] = useState({});

  useEffect(() => {
    if (!testUser?.data_vault) return;
    const dv = testUser.data_vault;
    const initRel = {};
    const initVis = {};
    channelsOfInterest.forEach((ch) => {
      const arr = dv[ch];
      if (!Array.isArray(arr)) return;
      arr.forEach((t, i) => {
        const key = `${ch}::${i}`;
        initRel[key] = !!t.is_relevant;
      });
      initVis[ch] = arr.length > 0;
    });
    setThreadRelevance(initRel);
    setChannelVisible(prev => ({ ...prev, ...initVis }));
  }, [testUser]);

  const toggleChannel = (ch) => setChannelVisible(prev => ({ ...prev, [ch]: !prev[ch] }));
  const toggleThread = (ch, idx) => {
    const key = `${ch}::${idx}`;
    setThreadRelevance(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const iconMap = {
    gmail: <FiMail className="text-rose-500" />,
    whatsapp: <FiMessageCircle className="text-emerald-500" />,
    slack: <SiSlack className="text-indigo-500" />,
    meetings: <FiCalendar className="text-amber-500" />,
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 w-80">
      {/* Project Header Card */}
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-indigo-600">
          <FiDatabase className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Active Workspace</span>
        </div>
        <h2 className="text-lg font-bold text-slate-800 leading-tight">
          {project?.projectName || project?.name || "New Analysis"}
        </h2>
        {project?.project_description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
            "{project.project_description}"
          </p>
        )}
      </div>

      {/* Data Sources Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Data Context Sources
        </h3>
        
        <div className="space-y-3">
          {testUser?.data_vault ? channelsOfInterest.map((ch) => {
            const list = testUser.data_vault[ch];
            if (!Array.isArray(list) || list.length === 0) return null;
            const isOpen = channelVisible[ch];

            return (
              <div key={ch} className={`group border rounded-xl overflow-hidden transition-all duration-300 bg-white ${isOpen ? 'ring-1 ring-indigo-100 shadow-md' : 'hover:border-indigo-200'}`}>
                {/* Channel Header */}
                <div 
                  className={`flex items-center justify-between p-3 cursor-pointer ${isOpen ? 'bg-slate-50/50 border-b border-slate-100' : ''}`}
                  onClick={() => toggleChannel(ch)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-slate-100`}>
                      {iconMap[ch]}
                    </div>
                    <span className="text-sm font-bold text-slate-700 capitalize">{ch}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
                      {list.length}
                    </span>
                  </div>
                  {isOpen ? <FiChevronDown className="text-slate-400" /> : <FiChevronRight className="text-slate-400" />}
                </div>

                {/* Thread List */}
                {isOpen && (
                  <div className="p-2 space-y-1 bg-white animate-in slide-in-from-top-1 duration-200">
                    {list.map((item, idx) => {
                      const key = `${ch}::${idx}`;
                      const isRelevant = threadRelevance[key];
                      const title = item.name || item.subject || item.thread_id || item.title || `${ch} #${idx+1}`;
                      
                      return (
                        <div 
                          key={key} 
                          onClick={() => toggleThread(ch, idx)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                            ${isRelevant ? 'bg-indigo-50/50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          <span className="text-xs font-medium truncate max-w-35">{title}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                            ${isRelevant ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                            {isRelevant && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-400 font-medium px-4">Initialize Data Vault to begin analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-2">
        <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
          <FiPlus className="w-4 h-4" />
          SYNTHESIZE BRD
        </button>
        <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all">
          ADD CUSTOM SOURCE
        </button>
      </div>
    </div>
  );
}