import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import EnginePanel from './EnginePanel';
import StatusTimeline from './StatusTimeline';

export default function WorkspaceManager({ currentStage, projectData }) {
  const { testUser } = useAuth();
  const [relevantChats, setRelevantChats] = useState({});

  useEffect(() => {
    if (!testUser || !testUser.data_vault) {
      setRelevantChats({});
      return;
    }

    const channels = ['gmail', 'whatsapp', 'slack', 'meetings'];
    const dv = testUser.data_vault || {};
    const collected = {};

    channels.forEach((ch) => {
      const list = Array.isArray(dv[ch]) ? dv[ch].filter((it) => it && it.is_relevant === true) : [];
      if (list.length) collected[ch] = list;
    });

    setRelevantChats(collected);
  }, [testUser]);

  return (
    // Cleaned height calculation and background consistency
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-slate-50/50 overflow-hidden">
      
      {/* Containerized spacing for the timeline to prevent layout shift */}
      <div className="w-full px-6 pt-6 pb-3">
        <StatusTimeline currentStage={currentStage} />
      </div>

      {/* Flex container refinement: 
          - flex-1 ensures it takes all remaining vertical space.
          - overflow-hidden prevents the body from scrolling, pushing scroll to panels.
      */}
      <div className="flex flex-row flex-1 w-full overflow-hidden p-6 gap-6">
        
        {/* Wrapper for EnginePanel:
            - bg-white + border maintains your 'Logic-First' theme.
            - shadow-sm for subtle depth without clutter.
        */}
        <div className="flex-1 h-full bg-white border border-slate-200/60 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          <EnginePanel 
            is_relevant_chats={relevantChats} 
            projectId={projectData?.id}
          />
        </div>
    
      </div>
    </div>
  );
}