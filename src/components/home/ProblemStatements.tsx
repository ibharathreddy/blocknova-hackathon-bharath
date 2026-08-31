import React from 'react';
import {
  Lock,
  UserCheck
} from 'lucide-react';

export const ProblemStatements: React.FC = () => {
  return (
    <section id="problem-statements" className="py-20 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Release Announcement Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-purple-500/30 relative overflow-hidden text-center shadow-2xl bg-gradient-to-b from-[#0f1026]/90 via-[#0a0b1c]/90 to-[#070814]/90">

          {/* Subtle top ambient line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"></div>

          {/* Phase Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-mono mb-6 backdrop-blur-md shadow-glow-purple">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>PHASE 2 • RELEASING SEPTEMBER 18, 2026</span>
          </div>

          {/* Heading */}
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Problem Statement <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Selection Phase</span>
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            The official problem statement tracks and deep-dive technical challenges will be unlocked for all registered teams during the <strong className="text-cyan-300 font-semibold">Problem Statement Selection Phase starting September 18, 2026</strong>.
          </p>

          {/* Call-to-action details pill */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center shrink-0 text-cyan-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white block text-sm mb-0.5">Register Your Team Now</span>
                <span className="text-slate-400">Complete Phase 1 registration to participate in problem selection on Sep 18.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
