import React from 'react';

export default function Step0({ project }) {
  const openSidebar = () => {
    const sidebar = document.querySelector('.w-80');
    if (sidebar) {
      sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // add a subtle highlight
      try {
        sidebar.animate([{ boxShadow: '0 0 0px rgba(99,102,241,0)' }, { boxShadow: '0 8px 30px rgba(99,102,241,0.12)' }], { duration: 800, easing: 'ease-out' });
      } catch (e) {}
    }
  };

  const openFilePicker = () => {
    const input = document.querySelector('.w-80 input[type=file]');
    if (input) {
      input.click();
    } else {
      // fallback: try any file input on page
      const fallback = document.querySelector('input[type=file]');
      if (fallback) fallback.click();
    }
  };

  return (
    <div className="p-4 text-sm text-slate-200">
      <div className="font-bold mb-2">Engine — Step 0: Initialization</div>
      <div className="mb-3">Prepare inputs and verify data lineage before ingestion.</div>

      <div className="mb-3 text-xs bg-amber-50 border border-amber-100 text-amber-800 px-3 py-2 rounded-md">
        Warning: Uploading files will automatically lock the project (status will change). This cannot be undone. Select relevant chats first and be careful.
      </div>

      <div className="flex gap-2">
        <button onClick={openSidebar} className="px-3 py-2 bg-slate-700 rounded-md text-sm">Open Sidebar</button>
        <button onClick={openFilePicker} className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">Choose Files</button>
      </div>
    </div>
  );
}
