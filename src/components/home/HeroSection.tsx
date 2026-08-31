import React from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  Zap,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onExplorePSClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onExplorePSClick
}) => {
  return (
    <section id="hero" className="relative min-h-[92vh] pt-28 pb-20 flex flex-col justify-center items-center overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-700/20 via-indigo-600/15 to-cyan-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">

        {/* Presenter Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-mono mb-6 backdrop-blur-md shadow-glow-purple">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>ALGORAND BLOCKCHAIN CLUB PRESENTS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300 font-semibold">VARDHAMAN COLLEGE</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white mb-4 leading-none">
          BLOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 text-glow-purple">NOVA</span>
        </h1>

        {/* Subtitle / Tagline */}
        <p className="font-display font-semibold text-lg sm:text-2xl lg:text-3xl text-slate-300 mb-3 tracking-wide">
          HACKATHON 2026
        </p>
        <p className="text-sm sm:text-base text-cyan-300/90 font-mono tracking-widest uppercase mb-8">
          Build. Innovate. Decentralize.
        </p>

        {/* Summary Description */}
        <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-light">
          A high-voltage 36-hour national innovation hackathon bringing together builders, innovators, and problem solvers to build real-world decentralized solutions on the Algorand blockchain and cutting-edge tech rails.
        </p>

        {/* Quick Glance Info Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm text-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Sep 18 – 19, 2026 (36 Hours)</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm text-slate-200 shadow-sm">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Vardhaman College, Hyderabad</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-sm text-amber-300 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold">₹1,00,000+ Prize Pool</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl cyber-gradient-btn text-white font-display font-bold text-base flex items-center justify-center gap-3 shadow-glow-purple group"
          >
            <Zap className="w-5 h-5 text-cyan-200 fill-cyan-200 group-hover:rotate-12 transition-transform" />
            <span>Register Your Team</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExplorePSClick}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-slate-300 font-display font-semibold text-base flex items-center justify-center gap-2.5 transition-all shadow-md group"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Learn More</span>
          </button>
        </div>

        {/* Countdown Timer Embed */}
        <CountdownTimer />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-4 sm:p-5 text-center border border-purple-500/20">
            <div className="font-display font-black text-2xl sm:text-3xl text-purple-400 mb-1">500+</div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Innovators</div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 text-center border border-cyan-500/20">
            <div className="font-display font-black text-2xl sm:text-3xl text-cyan-400 mb-1">20+</div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Expert Mentors</div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 text-center border border-amber-500/20">
            <div className="font-display font-black text-2xl sm:text-3xl text-amber-400 mb-1">₹1 Lakh+</div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Cash & Bounties</div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 text-center border border-emerald-500/20">
            <div className="font-display font-black text-2xl sm:text-3xl text-emerald-400 mb-1">36 Hrs</div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Non-Stop Building</div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              const el = document.getElementById('problem-statements');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-slate-500 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1 text-xs font-mono"
          >
            <span>DISCOVER MORE</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

      </div>
    </section>
  );
};
