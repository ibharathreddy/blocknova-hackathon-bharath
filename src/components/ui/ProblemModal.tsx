import React from 'react';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Terminal, 
  Scale, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ProblemStatement } from '../../types';

interface ProblemModalProps {
  problem: ProblemStatement | null;
  onClose: () => void;
  onSelectForRegistration: (psId: string) => void;
}

export const ProblemModal: React.FC<ProblemModalProps> = ({
  problem,
  onClose,
  onSelectForRegistration
}) => {
  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0d0e22] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5 relative z-10 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-950 text-cyan-300 border border-purple-800">
                {problem.psId}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                {problem.category}
              </span>
              {problem.difficulty && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/50">
                  {problem.difficulty}
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
              {problem.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="space-y-6 overflow-y-auto py-5 pr-1 relative z-10 text-sm text-slate-300">
          
          {/* Background & Description */}
          <div>
            <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Problem Background & Challenge
            </h4>
            <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
              {problem.fullDescription}
            </p>
          </div>

          {/* Expected Outcome */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Expected Deliverables & Solution
            </h4>
            <p className="text-slate-200 leading-relaxed bg-cyan-950/20 p-4 rounded-2xl border border-cyan-900/40 font-medium">
              {problem.expectedOutcome}
            </p>
          </div>

          {/* Requirements & Specifications */}
          {problem.requirements && problem.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Technical Requirements
              </h4>
              <ul className="space-y-2">
                {problem.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/50">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Key Constraints & Security Rules
              </h4>
              <ul className="space-y-2">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-amber-950/10 p-2.5 rounded-xl border border-amber-900/30">
                    <span className="text-amber-400 font-bold">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Technologies */}
          <div>
            <h4 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Suggested Technologies & SDKs
            </h4>
            <div className="flex flex-wrap gap-2">
              {problem.suggestedTech.map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-slate-400" />
              Track Evaluation Weight
            </h4>
            <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {problem.evaluationCriteria}
            </p>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Explorer
          </button>

          <button
            onClick={() => {
              onSelectForRegistration(problem.psId);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl cyber-gradient-btn text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-glow-purple"
          >
            <span>Select & Register with {problem.psId}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
