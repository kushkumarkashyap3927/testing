
import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import EnginePanel from './EnginePanel';
import PreviewPanel from './PreviewPanel';
import StatusTimeline from './StatusTimeline';


export default function WorkspaceManager({ currentStage, projectData }) {
  const { testUser } = useAuth();
  const [relevantChats, setRelevantChats] = useState({});
  const [ispreviewOpen, setIsPreviewOpen] = useState(false);

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
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      <div className="p-3">
        <StatusTimeline />
      </div>

      <div className="flex flex-row flex-1 gap-0 w-full overflow-hidden">
        <EnginePanel currentStage={currentStage}
         setIsPreviewOpen={setIsPreviewOpen} 
         isPreviewOpen={ispreviewOpen} 
         is_relevant_chats={relevantChats}
          />
        {ispreviewOpen && <PreviewPanel currentStage={currentStage} projectData={projectData}/>}
      </div>
    </div>
  );
}