import React from 'react';
import { useProject } from '../../components/providers/ProjectProvider';
import PreviewStep0 from './stepcomponents/preview/PreviewStep0';
import PreviewStep1 from './stepcomponents/preview/PreviewStep1';
import PreviewStep2 from './stepcomponents/preview/PreviewStep2';
import PreviewStep3 from './stepcomponents/preview/PreviewStep3';
import PreviewStep4 from './stepcomponents/preview/PreviewStep4';
import PreviewStep5 from './stepcomponents/preview/PreviewStep5';

export default function PreviewPanel() {
  const { project } = useProject() || {};
  const status = typeof project?.status === 'number' ? project.status : 0;

  return (
    <div className="w-1/2 h-full bg-white border border-slate-200/60 overflow-hidden flex flex-col">
      <div className="flex-1 p-2 overflow-auto">
        {status === 0 && <PreviewStep0 project={project} />}
        {status === 1 && <PreviewStep1 project={project} />}
        {status === 2 && <PreviewStep2 project={project} />}
        {status === 3 && <PreviewStep3 project={project} />}
        {status === 4 && <PreviewStep4 project={project} />}
        {status === 5 && <PreviewStep5 project={project} />}
      </div>
    </div>
  );
}
