import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Search,
  ArrowRight,
  FileText,
  Users,
  Sparkles,
  ShieldCheck,
  Layers,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { ProblemStatement } from '../../types';
import { ProblemModal } from '../ui/ProblemModal';
import { CATEGORIES } from '../../data/problemStatements';

interface ProblemStatementsProps {
  onSelectPSForRegistration?: (psId: string) => void;
  onRegisterClick?: () => void;
  onScheduleClick?: () => void;
}

export const ProblemStatements: React.FC<ProblemStatementsProps> = ({ 
  onSelectPSForRegistration,
  onRegisterClick,
  onScheduleClick
}) => {
  const { 
    problemStatements, 
    isPSReleased, 
    getPSSelectionStats, 
    setSelectedPSForRegistration 
  } = useRegistration();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalProblem, setSelectedModalProblem] = useState<ProblemStatement | null>(null);

  const handleEnrollOrRegister = (psId: string) => {
    setSelectedPSForRegistration(psId);
    if (onSelectPSForRegistration) {
      onSelectPSForRegistration(psId);
    } else {
      window.location.hash = 'register';
    }
  };

  // If problem statements are locked by admin, show the high-tech locked / releasing soon teaser UI
  if (!isPSReleased) {
    return (
      <section id="problem-statements" className="py-20 relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Header Area */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono shadow-glow-amber">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>PHASE 2 CHALLENGES LOCKED • TRACK SELECTION RELEASING SOON</span>
              </div>
              
              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
                Official Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Problem Statements</span>
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Problem statement challenges and track quotas are curated by hackathon organizers and are currently locked. Complete your team registration now during Phase 1 to get early priority access when challenges unlock!
              </p>
            </div>

            {/* Master Locked Cyber Display */}
            <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden bg-gradient-to-b from-[#0f1026]/90 via-[#0a0b1a]/95 to-[#070814]/95 shadow-2xl">
              {/* Top ambient highlight line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
                
                {/* Glowing Holographic Lock Graphic */}
                <div className="relative flex items-center justify-center pt-2">
                  {/* Concentric Glow Rings */}
                  <div className="absolute w-32 h-32 rounded-full border border-amber-500/20 animate-ping opacity-40"></div>
                  <div className="absolute w-28 h-28 rounded-full border border-purple-500/30"></div>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-600/30 to-cyan-500/20 border border-amber-500/40 backdrop-blur-xl flex items-center justify-center shadow-glow-amber">
                    <Lock className="w-9 h-9 text-amber-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60">
                    Status: Challenge Vault Encrypted
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    Tracks Unveiled During Phase 2
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
                    Teams will choose between Standard Entry Projects (AI & x402 Micropayments) and Composite Entry Projects (Algorand DApps & Web3 Infrastructure).
                  </p>
                </div>

                {/* 3 Teaser Track Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                        5 Unique Tracks
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">Standard Entry (SEP)</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      AI agent tools, prompt engines, and rapid utilities monetized via x402 pay-per-use Algorand micropayments.
                    </p>
                    <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5 pt-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked Until Phase 2</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        5 Advanced Tracks
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">Composite Entry (CEP)</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Full-stack decentralized apps, Algorand smart contracts, secure token standards, and on-chain verification.
                    </p>
                    <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5 pt-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked Until Phase 2</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        Strict Quotas
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">Fair Team Allocation</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Strict team limits per challenge. Early registered teams get instant notifications when track selection goes live.
                    </p>
                    <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 pt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>First-Come Allocation</span>
                    </div>
                  </div>
                </div>

                {/* Hackathon Progression Stepper */}
                <div className="w-full pt-4 border-t border-slate-800/80">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center gap-3 text-left">
                      <div className="w-7 h-7 rounded-lg bg-purple-900/80 text-purple-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-purple-700">
                        1
                      </div>
                      <div>
                        <div className="text-xs font-display font-bold text-white flex items-center gap-1.5">
                          <span>Phase 1: Registration</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Active
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Register your team now</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-3 text-left">
                      <div className="w-7 h-7 rounded-lg bg-amber-900/80 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-amber-700">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-display font-bold text-white flex items-center gap-1.5">
                          <span>Phase 2: Track Selection</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            Pending
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Problem statements unlock</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-left opacity-80">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                        3
                      </div>
                      <div>
                        <div className="text-xs font-display font-bold text-slate-200">
                          Phase 3: Hackathon
                        </div>
                        <p className="text-[11px] text-slate-400">36-hour sprint & demo</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Locked View */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onRegisterClick) {
                        onRegisterClick();
                      } else {
                        window.location.hash = 'register';
                      }
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl cyber-gradient-btn text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-purple transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Register Team to Prepare</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onScheduleClick) {
                        onScheduleClick();
                      } else {
                        window.location.hash = 'schedule';
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-display font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>View Event Timeline</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  const filteredProblems = problemStatements.filter(ps => {
    const matchesCat = activeCategory === 'All' || ps.category === activeCategory;
    const matchesSearch = 
      ps.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.psId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.suggestedTech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <section id="problem-statements" className="py-20 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Header Area */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-glow-emerald">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>CHALLENGES UNLOCKED • TRACK SELECTION OPEN</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              Official Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Problem Statements</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light">
              Explore the Standard and Composite Entry projects. Select your challenge and develop cutting-edge solutions monetized with x402 on Algorand.
            </p>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl glass-card border border-slate-800">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                const count = cat === 'All'
                  ? problemStatements.length
                  : problemStatements.filter(p => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] font-mono opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search challenges or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Problem Statements Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => {
              const stats = getPSSelectionStats(problem.psId);
              const isFull = stats.isFull;

              return (
                <div
                  key={problem.psId}
                  className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group space-y-4 relative overflow-hidden bg-gradient-to-b from-[#0e0f22]/90 to-[#080914]/90"
                >
                  {/* Top ambient hover line */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="space-y-3">
                    {/* Badge Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-black text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-1 rounded-lg">
                        {problem.psId}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                          {problem.trackType || 'Standard'}
                        </span>
                        {problem.difficulty && (
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                            {problem.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                      {problem.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-light">
                      {problem.shortDescription}
                    </p>

                    {/* Slot Capacity Status Indicator */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <span>Team Quota</span>
                        </span>
                        <span className={isFull ? 'text-rose-400 font-bold' : 'text-cyan-300 font-bold'}>
                          {stats.count} / {stats.maxTeams} Slots ({stats.remaining} left)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            isFull
                              ? 'bg-rose-500'
                              : stats.percentage >= 70
                              ? 'bg-amber-400'
                              : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                          }`}
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Suggested Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                      {problem.suggestedTech.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400">
                          {tech}
                        </span>
                      ))}
                      {problem.suggestedTech.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-500">
                          +{problem.suggestedTech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom CTA Buttons */}
                  <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedModalProblem(problem)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Specs</span>
                    </button>

                    {isFull ? (
                      <button
                        type="button"
                        disabled
                        className="py-2 px-3 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-400 text-xs font-mono font-bold cursor-not-allowed opacity-60"
                      >
                        <span>Slots Full</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEnrollOrRegister(problem.psId)}
                        className="py-2 px-3 rounded-xl cyber-gradient-btn text-white text-xs font-display font-bold flex items-center justify-center gap-1 shadow-glow-purple transition-all"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Problem Modal for Public View */}
      {selectedModalProblem && (
        <ProblemModal
          problem={selectedModalProblem}
          onClose={() => setSelectedModalProblem(null)}
          onSelectForRegistration={(psId) => {
            handleEnrollOrRegister(psId);
            setSelectedModalProblem(null);
          }}
        />
      )}
    </section>
  );
};
