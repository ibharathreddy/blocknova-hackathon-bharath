import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Coffee, 
  Sparkles, 
  Code2, 
  Users2, 
  Award, 
  Flag
} from 'lucide-react';
import { SCHEDULE_DATA } from '../../data/eventData';

export const ScheduleTimeline: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'Day 1 (Sep 18)' | 'Day 2 (Sep 19)'>('Day 1 (Sep 18)');

  const daySchedule = SCHEDULE_DATA.filter(item => item.day === activeDay);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Hacking':
        return { icon: Code2, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
      case 'Mentorship':
        return { icon: Users2, color: 'text-purple-400 bg-purple-950/60 border-purple-800' };
      case 'Food':
        return { icon: Coffee, color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
      case 'Judging':
        return { icon: Flag, color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
      case 'Ceremony':
        return { icon: Award, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      default:
        return { icon: Sparkles, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
    }
  };

  return (
    <section id="schedule" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>36-HOUR RHYTHM</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Schedule</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            From opening keynote to final pitches, every hour is engineered for rapid prototyping and high momentum.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveDay('Day 1 (Sep 18)')}
            className={`px-6 py-3 rounded-2xl font-display font-bold text-sm sm:text-base transition-all flex items-center gap-2 ${
              activeDay === 'Day 1 (Sep 18)'
                ? 'cyber-gradient-btn text-white shadow-glow-purple'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-cyan-300" />
            <span>Day 1 — Friday, Sep 18 (Kickoff & Build)</span>
          </button>

          <button
            onClick={() => setActiveDay('Day 2 (Sep 19)')}
            className={`px-6 py-3 rounded-2xl font-display font-bold text-sm sm:text-base transition-all flex items-center gap-2 ${
              activeDay === 'Day 2 (Sep 19)'
                ? 'cyber-gradient-btn text-white shadow-glow-cyan'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-cyan-300" />
            <span>Day 2 — Saturday, Sep 19 (Freeze & Pitches)</span>
          </button>
        </div>

        {/* Timeline Stack */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-purple-900/50 space-y-6">
          {daySchedule.map((item, idx) => {
            const badge = getCategoryBadge(item.category);
            const Icon = badge.icon;

            return (
              <div key={idx} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#070814] border-2 border-cyan-400 shadow-glow-cyan group-hover:scale-125 transition-transform"></div>

                {/* Event Card */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 group-hover:border-purple-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-900/50">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${badge.color}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-1.5 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{item.title}</span>
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
