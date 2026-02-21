import React, { useState } from 'react';
import { FiZap, FiArrowRight, FiDatabase, FiTag, FiClock, FiUser } from 'react-icons/fi';
import { useAuth } from '../providers/AuthProvider';
import { useProject } from '../providers/ProjectProvider';
import { mapFacts, increamentProjectStatus } from '../../apis/api';
import { toast } from 'sonner';

const toneConfig = {
    Positive: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    Negative: { bg: 'bg-rose-100', text: 'text-rose-700' },
    Neutral: { bg: 'bg-slate-100', text: 'text-slate-600' },
    Urgent: { bg: 'bg-amber-100', text: 'text-amber-700' },
    Skeptical: { bg: 'bg-purple-100', text: 'text-purple-700' },
    Formal: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
};

const sourceTypeConfig = {
    messaging: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
    file: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
};

function FactCard({ fact, index }) {
    const tone = toneConfig[fact.tone] || toneConfig.Neutral;
    const srcType = sourceTypeConfig[fact.sourceType] || sourceTypeConfig.messaging;
    const content = typeof fact.content === 'object' ? fact.content?.statement || JSON.stringify(fact.content) : String(fact.content);

    return (
        <div className="group p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-[10px] font-black text-indigo-500">
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{content}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {/* Source */}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${srcType.bg} ${srcType.border} ${srcType.text}`}>
                            <FiDatabase className="w-2.5 h-2.5" />
                            {fact.source}
                        </div>
                        {/* Tone */}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tone.bg} ${tone.text}`}>
                            <FiTag className="w-2.5 h-2.5" />
                            {fact.tone}
                        </div>
                        {/* Type */}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                            {fact.sourceType === 'file' ? '📄' : '💬'} {fact.sourceType}
                        </div>
                        {/* Date */}
                        {fact.when && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <FiClock className="w-2.5 h-2.5" />
                                {new Date(fact.when).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        )}
                    </div>
                </div>
                {/* Resolved indicator */}
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${fact.resolved ? 'bg-emerald-400' : 'bg-amber-400'}`} title={fact.resolved ? 'Active' : 'Superseded'} />
            </div>
        </div>
    );
}

export default function Step2_Facts() {
    const { testUser } = useAuth();
    const { project, fetchProject, facts, setFacts } = useProject() || {};
    const [running, setRunning] = useState(false);
    const [advancing, setAdvancing] = useState(false);

    const localFacts = facts || [];

    const handleRunExtraction = async () => {
        if (!project?.id || !testUser?.data_vault) return toast.error('Missing project or data vault');
        setRunning(true);
        try {
            const res = await mapFacts(project.id, testUser);
            const savedFacts = res?.data?.savedFacts || res?.savedFacts || [];
            if (setFacts) setFacts(savedFacts);
            toast.success(`${savedFacts.length} atomic facts extracted!`);
        } catch (err) {
            toast.error('Fact extraction failed');
        } finally {
            setRunning(false);
        }
    };

    const handleAdvance = async () => {
        if (!project?.id) return;
        setAdvancing(true);
        try {
            await increamentProjectStatus(project.id);
            await fetchProject(project.id);
            toast.success('Moving to DAG Conflict Detection →');
        } catch (err) {
            toast.error('Failed to advance stage');
        } finally {
            setAdvancing(false);
        }
    };

    const resolvedCount = localFacts.filter(f => f.resolved).length;
    const fileFactsCount = localFacts.filter(f => f.sourceType === 'file').length;

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full mb-4">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Stage 2 — Atomic Fact Extraction</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Neural FactID Sequence</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Decomposes every communication stream into independent, verifiable atomic claims.
                    </p>
                </div>
                <button
                    onClick={handleRunExtraction}
                    disabled={running}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wide hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg shadow-amber-200"
                >
                    {running ? (
                        <><span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />Running...</>
                    ) : (
                        <><FiZap className="w-4 h-4" />{localFacts.length > 0 ? 'Re-Extract' : 'Run Extraction'}</>
                    )}
                </button>
            </div>

            {/* Stats */}
            {localFacts.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="text-2xl font-black text-slate-800">{localFacts.length}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Facts</div>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="text-2xl font-black text-emerald-600">{resolvedCount}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active</div>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="text-2xl font-black text-amber-600">{fileFactsCount}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">From Files</div>
                    </div>
                </div>
            )}

            {/* Fact Feed */}
            {running && (
                <div className="flex flex-col items-center py-16">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm font-bold text-slate-500">Anvaya is decomposing communications...</p>
                    <p className="text-xs text-slate-400 mt-1">This may take 10–30 seconds</p>
                </div>
            )}

            {!running && localFacts.length > 0 && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {localFacts.map((f, i) => <FactCard key={f.id || i} fact={f} index={i} />)}
                </div>
            )}

            {!running && localFacts.length === 0 && (
                <div className="flex flex-col items-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                    <FiDatabase className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-400">No facts extracted yet</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Run Extraction" above to begin the FactID sequence.</p>
                </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-xl shadow-amber-200">
                <div>
                    <div className="text-white font-black text-sm">Detect Contradictions via DAG Analysis</div>
                    <div className="text-amber-100 text-xs mt-0.5">Stage 3 runs the Directed Acyclic Graph logic engine</div>
                </div>
                <button
                    onClick={handleAdvance}
                    disabled={advancing || localFacts.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {advancing ? (
                        <><span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />Advancing...</>
                    ) : (
                        <>Detect Conflicts <FiArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
