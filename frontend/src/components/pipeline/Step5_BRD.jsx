import React, { useState, useRef, useEffect } from 'react';
import {
    FiDownload, FiCopy, FiCheck, FiFileText, FiAward,
    FiSend, FiSave, FiMessageSquare, FiUser, FiCpu, FiRefreshCw
} from 'react-icons/fi';
import { useProject } from '../providers/ProjectProvider';
import { refineBRD, saveBRD } from '../../apis/api';
import { toast } from 'sonner';

// ─── MARKDOWN RENDERER ───────────────────────────────────────────────────────

function renderMarkdown(md) {
    if (!md) return null;
    return md.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-black text-slate-900 mt-6 mb-2 pb-2 border-b border-slate-200">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-base font-black text-slate-800 mt-5 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-indigo-700 mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('---')) return <hr key={i} className="my-3 border-slate-200" />;
        if (line.startsWith('- ')) return (
            <div key={i} className="flex items-start gap-2 my-0.5">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-xs text-slate-600">{line.slice(2)}</span>
            </div>
        );
        if (line.includes('**')) {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return <p key={i} className="text-xs text-slate-600 leading-relaxed my-0.5">{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-bold text-slate-800">{p}</strong> : p)}</p>;
        }
        if (line.trim() === '') return <div key={i} className="h-1.5" />;
        return <p key={i} className="text-xs text-slate-600 leading-relaxed my-0.5">{line}</p>;
    });
}

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────────

function ChatBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-600' : 'bg-slate-100 border border-slate-200'}`}>
                {isUser ? <FiUser className="w-3.5 h-3.5 text-white" /> : <FiCpu className="w-3.5 h-3.5 text-slate-500" />}
            </div>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                {msg.role === 'assistant' && msg.content === '...' ? (
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                ) : msg.content}
            </div>
        </div>
    );
}

// ─── PDF EXPORT ──────────────────────────────────────────────────────────────

function exportToPDF(projectName, brdMdx) {
    // Create a styled HTML document and print it
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>BRD - ${projectName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; font-size: 11px; color: #1e293b; line-height: 1.6; padding: 40px 60px; }
        h1 { font-size: 22px; font-weight: 900; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 2px solid #6366f1; color: #0f172a; }
        h2 { font-size: 15px; font-weight: 800; margin-top: 24px; margin-bottom: 6px; color: #1e293b; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
        h3 { font-size: 12px; font-weight: 700; margin-top: 16px; margin-bottom: 4px; color: #4f46e5; }
        p { margin: 4px 0; font-size: 11px; color: #475569; }
        ul { margin: 4px 0 4px 16px; }
        li { margin: 2px 0; color: #475569; }
        hr { margin: 16px 0; border: none; border-top: 1px solid #e2e8f0; }
        strong { font-weight: 700; color: #1e293b; }
        .header-badge { display: inline-block; background: #eef2ff; color: #4f46e5; font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; border-radius: 100px; margin-bottom: 12px; }
        .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
        @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <div class="header-badge">Verified by Anvaya.Ai · Data Lineage Preserved</div>
      ${brdMdx
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^---$/gm, '<hr/>')
            .replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<br/>')
            .replace(/\n/g, ' ')}
      <div class="footer">Generated by Anvaya.Ai · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </body>
    </html>
  `;
    const win = window.open('', '_blank');
    if (!win) { toast.error('Pop-up blocked. Please allow pop-ups for this site.'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Step5_BRD() {
    const { project, setProject } = useProject() || {};
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);

    // Live BRD content (local, mutable before save)
    const [liveBRD, setLiveBRD] = useState(project?.brdMdx || '');
    const [isDirty, setIsDirty] = useState(false);

    // Chat
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', content: 'Hi! I\'m the Anvaya Refinement Engine. Describe any changes you\'d like to make to this BRD — e.g. "Add a risk section for PCI compliance" or "Rewrite the executive summary to be more concise".' }
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (project?.brdMdx) setLiveBRD(project.brdMdx);
    }, [project?.brdMdx]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(liveBRD);
            setCopied(true);
            toast.success('Copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch { toast.error('Copy failed'); }
    };

    const handleDownloadMD = () => {
        const blob = new Blob([liveBRD], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BRD_${project?.projectName?.replace(/\s+/g, '_') || 'document'}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportPDF = () => {
        exportToPDF(project?.projectName || 'BRD', liveBRD);
    };

    const handleSave = async () => {
        if (!project?.id || !liveBRD) return;
        setSaving(true);
        try {
            await saveBRD(project.id, liveBRD);
            setIsDirty(false);
            if (setProject) setProject(prev => ({ ...prev, brdMdx: liveBRD }));
        } catch (err) {
            toast.error('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || thinking || !project?.id) return;
        const userMsg = input.trim();
        setInput('');

        const newHistory = [...chatHistory, { role: 'user', content: userMsg }, { role: 'assistant', content: '...' }];
        setChatHistory(newHistory);
        setThinking(true);

        try {
            const res = await refineBRD(project.id, userMsg);
            const refined = res?.data?.refinedBRD || res?.refinedBRD || '';
            if (refined) {
                setLiveBRD(refined);
                setIsDirty(true);
            }
            setChatHistory(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: refined ? '✅ BRD updated! Review the document on the left. Save when ready.' : '⚠️ Refinement returned no content.' }
            ]);
        } catch {
            setChatHistory(prev => [...prev.slice(0, -1), { role: 'assistant', content: '❌ Refinement failed. Please try again.' }]);
        } finally {
            setThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full mb-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Stage 5 — Truth Synthesis</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">BRD · Refine & Export</h2>
                    <p className="text-sm text-slate-500 mt-1">Audit-ready BRD with full data lineage. Use the chat to refine, then export.</p>
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center gap-2 flex-wrap">
                    {isDirty && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-60"
                        >
                            {saving ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiSave className="w-3.5 h-3.5" />}
                            {saving ? 'Saving...' : 'Save to Project'}
                        </button>
                    )}
                    <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                        {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> : <FiCopy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy MD'}
                    </button>
                    <button onClick={handleDownloadMD} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                        <FiDownload className="w-3.5 h-3.5" />
                        .md
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg"
                    >
                        <FiDownload className="w-3.5 h-3.5" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Completion Badge */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-200 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <FiAward className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800">Anvaya Pipeline Complete</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Project: <strong>{project?.projectName}</strong> · All 5 stages · Full data lineage</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 rounded-full">
                    <FiCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-700 uppercase">Verified</span>
                </div>
                {isDirty && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 rounded-full">
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-amber-700 uppercase">Unsaved changes</span>
                    </div>
                )}
            </div>

            {/* Split View: BRD | Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── LEFT: BRD Document ── */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-32">
                    <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                        <FiFileText className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest truncate">
                            {project?.projectName || 'BRD Document'}
                            {isDirty && <span className="ml-2 text-amber-500">●</span>}
                        </span>
                    </div>
                    <div className="px-6 py-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
                        {liveBRD
                            ? renderMarkdown(liveBRD)
                            : <p className="text-sm text-slate-400 text-center py-12">No BRD content yet.</p>
                        }
                    </div>
                </div>

                {/* ── RIGHT: Gemini Chat ── */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: '70vh' }}>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border-b border-indigo-100 shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <FiCpu className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="text-xs font-black text-indigo-700">Anvaya Refinement Engine</div>
                            <div className="text-[10px] text-indigo-500">Grounded in verified facts · Gemini-powered</div>
                        </div>
                        <div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
                        {chatHistory.map((msg, i) => (
                            <ChatBubble key={i} msg={msg} />
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="shrink-0 px-4 py-3 border-t border-slate-100 bg-slate-50">
                        <div className="flex items-end gap-2">
                            <textarea
                                className="flex-1 px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-indigo-400 focus:bg-white transition-all max-h-28"
                                rows={2}
                                placeholder={`e.g. "Add a risk section for Q2 audit"…`}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={thinking}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || thinking}
                                className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-indigo-200"
                            >
                                {thinking
                                    ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <FiSend className="w-3.5 h-3.5" />
                                }
                            </button>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1.5 text-center">
                            Press Enter to send · Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
