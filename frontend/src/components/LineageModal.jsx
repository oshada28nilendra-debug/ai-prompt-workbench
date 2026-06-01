import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Clock, GitCommit, Clipboard, CornerDownRight } from 'lucide-react';

export default function LineageModal({ promptId, onClose, onCopy }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (promptId) {
      fetchHistory();
    }
  }, [promptId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/prompts/${promptId}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching lineage tree history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-end z-50 transition-opacity">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl overflow-y-auto animate-slide-in">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-cyan-400 w-5 h-5" />
              Prompt Lineage Tree
            </h2>
            <p className="text-slate-400 text-xs mt-1">Tracing iterations and structural generation parameters.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading / Content State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Compiling version lineage...
          </div>
        ) : (
          <div className="flex-1 space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-0.5 before:bg-slate-800">
            {history.map((version, index) => {
              const isRoot = !version.parentPrompt;
              
              return (
                <div key={version._id} className="relative pl-10 group">
                  {/* Timeline Node Point Indicator */}
                  <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 transition-colors z-10 ${
                    isRoot 
                      ? 'bg-cyan-500 border-cyan-400 shadow-sm shadow-cyan-500/50' 
                      : 'bg-slate-900 border-slate-700 group-hover:border-cyan-500'
                  }`} />

                  {/* Version Box Wrapper */}
                  <div className="bg-slate-800/40 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-0.5">
                          {isRoot ? 'Base Layer' : `Iteration Branch v${index + 1}`}
                        </span>
                        <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                          {!isRoot && <CornerDownRight className="w-3.5 h-3.5 text-cyan-500" />}
                          {version.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Code Prompt Box */}
                    <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-950/60 font-mono mb-3 break-words line-clamp-3">
                      {version.positivePrompt}
                    </p>

                    {/* Metadata & Actions */}
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <div className="flex gap-3">
                        <span>Model: <strong className="text-slate-300">{version.parameters?.model}</strong></span>
                        <span>Ratio: <strong className="text-slate-300">{version.parameters?.aspectRatio}</strong></span>
                      </div>
                      <button
                        onClick={() => onCopy(version.positivePrompt)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <Clipboard className="w-3 h-3" /> Copy String
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