import { useState, useEffect } from 'react';
import EnginePanel from './EnginePanel';
import StatusTimeline from './StatusTimeline';
import { useProject } from '../providers/ProjectProvider';
import { use } from 'react';

export default function WorkspaceManager( ) {

  const [status = 0, setStatus] = useState(0);
  const { project } = useProject() || {};
  useEffect(() => {
    if (project && typeof project.status === 'number') {
      setStatus(project.status);
    }
  }, [project]);





  return (
    // Cleaned height calculation and background consistency
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-slate-50/50 overflow-hidden">
      
      {/* Containerized spacing for the timeline to prevent layout shift */}
      <div className="w-full px-6 pt-6 pb-3">
        <StatusTimeline currentStage={status} />
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
          
            projectId={project?.id}
          />
        </div>
    
      </div>
    </div>
  );
}