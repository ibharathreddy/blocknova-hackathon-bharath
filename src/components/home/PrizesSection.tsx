import React from 'react';
import { Trophy } from 'lucide-react';
import { PRIZES_DATA } from '../../data/eventData';

export const PrizesSection: React.FC = () => {
  return (
    <section id="prizes" className="py-20 relative overflow-hidden bg-[#070816]">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-mono mb-3 shadow-glow-amber">
            <Trophy className="w-3.5 h-3.5" />
            <span>REWARDS & RECOGNITION</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Compete for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">₹1,00,000+</span> in Prizes
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Direct cash prizes for winning teams.
          </p>
        </div>

        {/* Podium 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-stretch">
          {PRIZES_DATA.map((prize) => {
            const isFirst = prize.rank === '1st';
            return (
              <div
                key={prize.rank}
                className={`glass-card rounded-3xl p-8 border ${prize.border} flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${isFirst
                    ? 'md:-translate-y-4 bg-gradient-to-b from-[#1c1836] via-[#101128] to-[#0a0b1c] shadow-2xl ring-1 ring-yellow-500/30'
                    : 'bg-[#0f1026]/80 hover:-translate-y-2'
                  }`}
              >
                {/* Top Badge */}
                {isFirst && (
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 py-1 text-center text-black font-display font-black text-[11px] uppercase tracking-widest">
                    ⭐ Grand Champion
                  </div>
                )}

                <div className={isFirst ? 'pt-4' : ''}>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-display font-black text-xl text-white">
                      {prize.rank}
                    </span>
                    <Trophy className={`w-8 h-8 ${isFirst ? 'text-yellow-400 animate-pulse' : 'text-slate-400'}`} />
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    {prize.title}
                  </h3>

                  <div className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                    {prize.amount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
