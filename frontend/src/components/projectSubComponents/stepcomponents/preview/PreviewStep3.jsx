import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCheckCircle, FiCode, FiActivity, FiTerminal, FiLoader } from 'react-icons/fi';
import { increamentProjectStatus, resolveContradiction } from '../../../../apis/api';
import { useProject } from '../../../providers/ProjectProvider';

export default function PreviewStep3({ result = [], onBack, projectId, onIncrementSuccess }) {
  const items = Array.isArray(result) ? result : [];
  console.log('PreviewStep3 received result:', result);
  const { fetchProject } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState({});
  const [factsMap, setFactsMap] = useState({});

  useEffect(() => {
    const loadFacts = async () => {
      if (!projectId) return;
      try {
        const proj = await fetchProject(projectId);
        const factsArr = proj?.facts || proj?.data?.facts || [];
        const map = {};
        for (const f of factsArr) map[f.id] = f;
        setFactsMap(map);
      } catch (e) {
        console.error('Failed to load project facts for preview:', e);
      }
    };
    loadFacts();
  }, [projectId]);

  const renderContent = (content) => {
    if (content == null) return 'Untitled fact';
    if (typeof content === 'string') return content;
    try {
      if (typeof content === 'object') {
        if (content.text) return content.text;
        if (content.content) return content.content;
        if (content.statement) return content.statement;
        return JSON.stringify(content);
      }
      return String(content);
    } catch (e) {
      return String(content);
    }
  };

  const handleProceed = async () => {
    setError(null);
    setLoading(true);
    try {
      await increamentProjectStatus(projectId);
      await fetchProject(projectId);
      if (onIncrementSuccess) onIncrementSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (id, patch) => {
    setForms((s) => ({ ...(s || {}), [id]: { ...(s?.[id] || {}), ...patch } }));
  };

  const handleResolve = async (c) => {
    const id = c.id;
    const form = forms?.[id] || {};
    const { winnerFactId, useCustom, customInput, reasoning } = form;

    // Enforce XOR: either a winnerFactId OR customInput (useCustom) but not both or neither
    if ((useCustom && winnerFactId) || (!useCustom && !winnerFactId && !customInput)) {
      updateForm(id, { error: 'Provide either a winning fact or a custom resolution (not both).' });
      return;
    }
    if (!reasoning || String(reasoning).trim() === '') {
      updateForm(id, { error: 'Resolution reasoning is mandatory.' });
      return;
    }

    updateForm(id, { resolving: true, error: null });
    try {
      const payload = {
        contradictionId: id,
        reasoning: reasoning || 'Resolved via UI',
      };
      if (useCustom) payload.custom_input = customInput || '';
      else payload.winnerFactId = winnerFactId;

      await resolveContradiction(projectId, payload);
      // refresh project state for all users
      await fetchProject(projectId);
      if (onIncrementSuccess) await onIncrementSuccess();
      updateForm(id, { resolving: false, success: 'Resolved', disabled: true });
    } catch (err) {
      console.error('resolve error', err);
      updateForm(id, { resolving: false, error: String(err) });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden p-8 animate-in fade-in duration-500 relative">
      
      {/* Header: Global Actions */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Audit Preview</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Neural Contradiction Summary</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleProceed}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
            {loading ? 'Committing Logic...' : 'Authorize & Resolve'}
          </button>

          <button
            onClick={async () => {
              // Build batch payload from forms for all items
              const payload = [];
              let hasError = false;
              for (const c of items) {
                const f = forms?.[c.id] || {};
                if (f?.disabled) continue;
                const { winnerFactId, useCustom, customInput, reasoning } = f;
                // XOR check
                if ((useCustom && winnerFactId) || (!useCustom && !winnerFactId && !customInput)) {
                  updateForm(c.id, { error: 'Provide either a winning fact or a custom resolution (not both).' });
                  hasError = true;
                  continue;
                }
                if (!reasoning || String(reasoning).trim() === '') {
                  updateForm(c.id, { error: 'Resolution reasoning is mandatory.' });
                  hasError = true;
                  continue;
                }

                const itemPayload = { contradictionId: c.id, reasoning };
                if (useCustom) itemPayload.custom_input = customInput || '';
                else itemPayload.winnerFactId = winnerFactId;
                payload.push(itemPayload);
              }

              if (hasError || payload.length === 0) return;

              // submit batch
              try {
                // show loading state globally
                setLoading(true);
                await resolveContradiction(projectId, payload);
                // refresh project
                await fetchProject(projectId);
                // mark successes
                for (const c of items) updateForm(c.id, { success: 'Resolved', disabled: true });
                if (onIncrementSuccess) await onIncrementSuccess();
              } catch (err) {
                console.error('Batch resolve error', err);
              } finally {
                setLoading(false);
              }
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95"
          >
            Resolve All
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase">
          Logic Error: {error}
        </div>
      )}

      {/* Main Content: Decision Cards */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="p-10 bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Log Entries Found</p>
          </div>
                ) : (
          items.map((c, idx) => {
            const form = forms?.[c.id] || {};
            return (
            <div key={c.id ?? idx} className="bg-slate-50/50 border border-slate-200/60 rounded-[2.5rem] overflow-hidden">
              {/* Card Header */}
              <div className="px-8 py-5 bg-white border-b border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiTerminal className="text-indigo-600 text-xs" />
                  <span className="text-[10px] font-black text-slate-900 uppercase">Conflict_Log_{idx + 1}</span>
                </div>
                <div className="px-3 py-1 bg-slate-900 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                  Verified Snapshot
                </div>
              </div>

              <div className="p-8">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4 leading-relaxed">
                  {c.context || "Manual Review Required"}
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Source_Lineage</span>
                    <p className="text-[10px] font-bold text-slate-700 truncate">Project_Ref: {c.projectId?.slice(-8)}</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Fact_Count</span>
                    <p className="text-[10px] font-bold text-slate-700">{(c.contradiction_facts || []).length} Points</p>
                  </div>
                </div>

                {/* Raw Trace Log */}
                <div className="bg-slate-900 rounded-2xl p-6 relative group">
                  <FiCode className="absolute top-4 right-4 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Logic_Stream_Data:</div>
                  <pre className="text-[11px] text-slate-400 font-mono overflow-auto max-h-40 custom-scrollbar leading-relaxed">
                    {JSON.stringify(c, null, 2)}
                  </pre>
                </div>

                {/* Resolve Form */}
                <div className="mt-6 p-4 bg-white border border-slate-100 rounded-2xl">
                  <div className="text-[11px] font-black text-slate-700 mb-2">Resolve Contradiction</div>
                  <div className="flex items-center gap-3 mb-3">
                    <select
                      value={form.winnerFactId || ''}
                      onChange={(e) => updateForm(c.id, { winnerFactId: e.target.value, useCustom: false })}
                      className="px-3 py-2 border rounded flex-1 text-[12px]"
                      disabled={form.disabled}
                    >
                      <option value="">Choose winning fact (optional)</option>
                      {(c.contradiction_facts || []).map((fid) => (
                        <option key={fid} value={fid}>{fid} — {renderContent(factsMap[fid]?.content ?? factsMap[fid]?.fact)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => updateForm(c.id, { useCustom: !form.useCustom, winnerFactId: '' })}
                      className={`px-3 py-2 border rounded text-[12px] ${form.useCustom ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      {form.useCustom ? 'Using Custom' : 'Use Custom'}
                    </button>
                  </div>

                  {form.useCustom && (
                    <textarea
                      placeholder="Custom resolution text"
                      value={form.customInput || ''}
                      onChange={(e) => updateForm(c.id, { customInput: e.target.value })}
                      className="w-full p-3 border rounded text-[12px] mb-3"
                    />
                  )}

                  <textarea
                    placeholder="Reasoning (required)"
                    value={form.reasoning || ''}
                    onChange={(e) => updateForm(c.id, { reasoning: e.target.value })}
                    className="w-full p-3 border rounded text-[12px] mb-3"
                  />

                  {form.error && <div className="text-rose-500 text-xs mb-2">{form.error}</div>}
                  {form.success && <div className="text-emerald-600 text-xs mb-2">{form.success}</div>}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleResolve(c)}
                      disabled={form.resolving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded text-[12px]"
                    >
                      {form.resolving ? <FiLoader className="animate-spin inline" /> : 'Resolve'}
                    </button>
                    <button
                      onClick={() => setForms((s) => ({ ...(s || {}), [c.id]: {} }))}
                      className="px-3 py-2 border rounded text-[12px]"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )
          })
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 pt-4 flex items-center justify-between opacity-30">
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Anvaya.Ai // Logic_Reconciliation_Layer</span>
         <FiActivity className="text-slate-400" />
      </div>
    </div>
  );
}