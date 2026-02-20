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
    <div className="w-full h-full flex flex-col bg-slate-900 border border-slate-800 overflow-hidden relative">
      <div className="flex-1 p-3 overflow-auto">
        {status === 0 && <Step0 project={project} />}
        {status === 1 && <Step1 project={project} />}
        {status === 2 && <Step2 project={project} />}
        {status === 3 && <Step3 project={project} />}
        {status === 4 && <Step4 project={project} />}
        {status === 5 && <Step5 project={project} />}
      </div>
    </div>
  );
}
