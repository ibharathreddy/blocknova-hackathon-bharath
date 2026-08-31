import React from 'react';
import {
  ExternalLink,
  Handshake
} from 'lucide-react';
import { SPONSORS_DATA } from '../../data/eventData';

const AlgorandLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M137.6 448L320 128h-70.4L67.2 448h70.4zm166.4-166.4L435.2 448h70.4L374.4 281.6h-70.4zM320 64l64 128h70.4L390.4 64H320z" />
  </svg>
);

export const SponsorsSection: React.FC = () => {
  const titleSponsor = SPONSORS_DATA.find(s => s.tier === 'title');

  return (
    <section id="sponsors" className="py-16 relative overflow-hidden bg-[#070815]">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-3">
            <Handshake className="w-3.5 h-3.5" />
            <span>TITLE SPONSOR</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Sponsored by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Algorand Foundation</span>
          </h2>
        </div>

        {/* Big Prominent Title Sponsor Card */}
        {titleSponsor && (
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-cyan-500/40 bg-gradient-to-b from-[#121330]/90 via-[#0d0e24]/90 to-[#070816]/90 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">

              {/* Top ambient glow bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500"></div>

              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Big Algorand Logo Badge */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white text-black p-4 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <AlgorandLogo className="w-full h-full text-black" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                      {titleSponsor.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/60 shadow-glow-amber">
                      ⭐ Title Sponsor
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 max-w-lg leading-relaxed font-light">
                    {titleSponsor.tagline}
                  </p>
                </div>
              </div>

              <a
                href={titleSponsor.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl cyber-gradient-btn text-white font-display font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-glow-purple group-hover:shadow-glow-cyan transition-all"
              >
                <span>Visit Algorand</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
