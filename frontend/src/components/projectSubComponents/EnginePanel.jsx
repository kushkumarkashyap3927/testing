import React from 'react';
import { useProject } from '../../components/providers/ProjectProvider';
import Step0 from './stepcomponents/engine/Step0';
import Step1 from './stepcomponents/engine/Step1';
import Step2 from './stepcomponents/engine/Step2';
import Step3 from './stepcomponents/engine/Step3';
import Step4 from './stepcomponents/engine/Step4';
import Step5 from './stepcomponents/engine/Step5';

export default function EnginePanel() {
  const { project } = useProject() || {};
  const status = typeof project?.status === 'number' ? project.status : 0;

  return (
    // Removed redundant borders to allow the WorkspaceManager wrapper to shine.
    // 'min-h-0' is crucial here to allow the 'flex-1' child to scroll properly in Chrome/Safari.
    <div className="w-full h-full flex flex-col bg-white min-h-0 relative">
      
      {/* Main Step Content Container:
          - p-6: Standardized padding to match the 'Logic-First' theme.
          - overflow-y-auto: Ensures Step1/PreviewStep1 can grow vertically.
          - flex-1: Takes up all available space inside the panel.
      */}
      <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="max-w-[1400px] mx-auto h-full">
          {status === 0 && <Step0 project={project} />}
          {status === 1 && <Step1 project={project}  />}
          {status === 2 && <Step2 project={project} />}
          {status === 3 && <Step3 project={project} />}
          {status === 4 && <Step4 project={project} />}
          {status === 5 && <Step5 project={project} />}
        </div>
      </div>

      {/* Blueprint Texture (Internal): 
          Matched to the Home page for a cohesive feel within the engine.
      */}
      <div className="absolute inset-0 -z-10 opacity-[0.015] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
    </div>
  );
}