import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Clipboard, Copy, Layers, Sparkles, X, Clock, 
  CornerDownRight, Image as ImageIcon, Settings2, Terminal
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/prompts';

// ==========================================
// 1. LINEAGE MODAL COMPONENT (Beautiful Timeline)
// ==========================================
function LineageModal({ promptId, onClose, onCopy }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (promptId) fetchHistory();
  }, [promptId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/${promptId}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching lineage tree history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-500">
      <div className="w-full max-w-lg h-full bg-[#0a0a0c] border-l border-white/10 p-8 shadow-2xl overflow-y-auto flex flex-col relative animate-in slide-in-from-right duration-300">
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clock className="text-indigo-400 w-6 h-6" />
              Version History
            </h2>
            <p className="text-zinc-400 text-sm mt-1">Tracing the evolution of this generation.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-4">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm tracking-wide">Compiling lineage...</p>
          </div>
        ) : (
          <div className="flex-1 space-y-8 relative before:absolute before:top-3 before:bottom-3 before:left-[11px] before:w-[2px] before:bg-white/5 z-10">
            {history.map((version, index) => {
              const isRoot = !version.parentPrompt;
              
              return (
                <div key={version._id} className="relative pl-10 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-[3px] border-[#0a0a0c] flex items-center justify-center z-10 transition-colors duration-300 ${
                    isRoot ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-zinc-700 group-hover:bg-indigo-400'
                  }`} />

                  {/* Version Card */}
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block mb-1">
                          {isRoot ? 'Origin Prompt' : `Iteration v${index + 1}`}
                        </span>
                        <h4 className="font-semibold text-base text-zinc-100 flex items-center gap-2">
                          {!isRoot && <CornerDownRight className="w-4 h-4 text-zinc-500" />}
                          {version.title}
                        </h4>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-xl p-3 mb-4 border border-white/5">
                      <p className="text-sm text-zinc-300 font-mono leading-relaxed line-clamp-4">
                        {version.positivePrompt}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5"/> {version.parameters?.model}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>{version.parameters?.aspectRatio}</span>
                      </div>
                      <button
                        onClick={() => onCopy(version.positivePrompt)}
                        className="text-white bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
                      >
                        <Clipboard className="w-3.5 h-3.5" /> Copy
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


// ==========================================
// 2. MAIN APP COMPONENT (Premium Dashboard)
// ==========================================
export default function App() {
  const [prompts, setPrompts] = useState([]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    positivePrompt: '',
    negativePrompt: '',
    aspectRatio: '16:9',
    model: 'Midjourney v6',
    imageUrl: '',
    parentPrompt: null
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setPrompts(res.data);
    } catch (err) {
      console.error('Error fetching prompts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title || 'Untitled Generation',
        positivePrompt: formData.positivePrompt,
        negativePrompt: formData.negativePrompt,
        parameters: {
          aspectRatio: formData.aspectRatio,
          model: formData.model
        },
        imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
        parentPrompt: formData.parentPrompt
      };

      await axios.post(API_BASE, payload);
      setFormData({
        title: '',
        positivePrompt: '',
        negativePrompt: '',
        aspectRatio: '16:9',
        model: 'Midjourney v6',
        imageUrl: '',
        parentPrompt: null
      });
      fetchPrompts();
      toast.success(formData.parentPrompt ? 'Branch created successfully!' : 'Base prompt saved!', {
        icon: '✨',
        style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '12px' }
      });
    } catch (err) {
      toast.error('Failed to save prompt.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Prompt copied to clipboard!', {
      style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '12px' }
    });
  };

  const handleBranch = (p) => {
    setFormData({
      title: `${p.title} (v2)`,
      positivePrompt: p.positivePrompt,
      negativePrompt: p.negativePrompt || '',
      aspectRatio: p.parameters?.aspectRatio || '16:9',
      model: p.parameters?.model || 'Midjourney v6',
      imageUrl: '',
      parentPrompt: p._id
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-indigo-500/30 pb-20 relative overflow-hidden">
      <Toaster position="bottom-right" />
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 relative z-10">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Premium AI Tooling
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              Prompt Workbench.
            </h1>
            <p className="text-zinc-400 mt-3 text-base max-w-xl leading-relaxed">
              Design, version, and orchestrate high-fidelity generative AI workflows with a developer-first interface.
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* ============================== */}
          {/* LEFT COLUMN: STICKY FORM PANEL */}
          {/* ============================== */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-8">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Form internal glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px]" />

              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white relative z-10">
                {formData.parentPrompt ? (
                  <><Layers className="text-purple-400 w-5 h-5" /> Branching Variation</>
                ) : (
                  <><Sparkles className="text-indigo-400 w-5 h-5" /> Design Generation</>
                )}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    placeholder="e.g., Cyberpunk Street Scene"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                {/* Positive Prompt */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Positive Prompt</label>
                  <textarea 
                    required rows="4"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                    placeholder="cinematic lighting, hyper-realistic, 8k resolution..."
                    value={formData.positivePrompt}
                    onChange={(e) => setFormData({...formData, positivePrompt: e.target.value})}
                  />
                </div>

                {/* Negative Prompt */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Negative Prompt</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    placeholder="blurry, distorted, low quality"
                    value={formData.negativePrompt}
                    onChange={(e) => setFormData({...formData, negativePrompt: e.target.value})}
                  />
                </div>

                {/* Parameters Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Terminal className="w-3 h-3"/> Model</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                    >
                      <option className="bg-zinc-900">Midjourney v6</option>
                      <option className="bg-zinc-900">Stable Diffusion 3</option>
                      <option className="bg-zinc-900">DALL-E 3</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Settings2 className="w-3 h-3"/> Ratio</label>
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
                      value={formData.aspectRatio}
                      onChange={(e) => setFormData({...formData, aspectRatio: e.target.value})}
                    >
                      <option className="bg-zinc-900">16:9</option>
                      <option className="bg-zinc-900">1:1</option>
                      <option className="bg-zinc-900">4:5</option>
                      <option className="bg-zinc-900">21:9</option>
                    </select>
                  </div>
                </div>

                {/* Optional Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><ImageIcon className="w-3 h-3"/> Reference Image URL</label>
                  <input 
                    type="url" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>

                {/* Active Branch Indicator */}
                {formData.parentPrompt && (
                  <div className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs p-3 rounded-xl flex justify-between items-center animate-in fade-in zoom-in duration-300">
                    <span className="flex items-center gap-2"><CornerDownRight className="w-3.5 h-3.5"/> Modifying lineage branch</span>
                    <button type="button" onClick={() => setFormData({...formData, parentPrompt: null})} className="text-purple-200 hover:text-white underline font-medium">Cancel</button>
                  </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 active:scale-[0.98] text-sm font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 mt-4">
                  {formData.parentPrompt ? 'Save Branch Variation' : 'Initialize Base Prompt'}
                </button>
              </form>
            </div>
          </div>

          {/* ============================== */}
          {/* RIGHT COLUMN: GALLERY FEED     */}
          {/* ============================== */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Layers className="text-zinc-400 w-5 h-5" />
                Workspace Repository
              </h2>
              <span className="bg-white/5 text-zinc-400 text-xs px-3 py-1 rounded-full border border-white/10">
                {prompts.length} Saved
              </span>
            </div>

            {prompts.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-[400px]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Generations Yet</h3>
                <p className="text-zinc-500 text-sm max-w-sm">Your prompt repository is empty. Configure your first base prompt on the left to start tracking your AI experiments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {prompts.map((p) => (
                  <div key={p._id} className="group bg-[#0f0f12] border border-white/[0.06] rounded-3xl overflow-hidden hover:bg-[#131318] hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col h-full">
                    
                    {/* Optional Image Header */}
                    {p.imageUrls?.[0] && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] to-transparent z-10" />
                        <img src={p.imageUrls[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <h3 className="font-bold text-lg text-white leading-tight">{p.title}</h3>
                        <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-indigo-300">
                          {p.parameters?.model}
                        </span>
                      </div>
                      
                      <div className="bg-black/30 rounded-xl p-3 border border-white/5 mb-5 flex-1">
                        <p className="text-sm text-zinc-400 font-mono leading-relaxed line-clamp-3">
                          {p.positivePrompt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                        <button 
                          onClick={() => copyToClipboard(p.positivePrompt)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
                        >
                          <Clipboard className="w-3.5 h-3.5 text-zinc-400" /> Copy
                        </button>
                        <button 
                          onClick={() => handleBranch(p)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
                        >
                          <CornerDownRight className="w-3.5 h-3.5 text-zinc-400" /> Branch
                        </button>
                        <button 
                          onClick={() => setActiveHistoryId(p._id)}
                          className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
                        >
                          <Clock className="w-3.5 h-3.5" /> History
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render the Lineage Modal if an active history ID is set */}
      {activeHistoryId && (
        <LineageModal 
          promptId={activeHistoryId} 
          onClose={() => setActiveHistoryId(null)} 
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
}