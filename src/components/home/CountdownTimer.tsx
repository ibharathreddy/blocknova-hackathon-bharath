import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { EVENT_CONFIG } from '../../data/eventData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
}

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isStarted: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(EVENT_CONFIG.startDateISO).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isStarted: true
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isStarted: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days, color: 'from-purple-500 to-indigo-500' },
    { label: 'HOURS', value: timeLeft.hours, color: 'from-indigo-500 to-cyan-500' },
    { label: 'MINUTES', value: timeLeft.minutes, color: 'from-cyan-500 to-teal-400' },
    { label: 'SECONDS', value: timeLeft.seconds, color: 'from-teal-400 to-emerald-400' },
  ];

  return (
    <div className="relative inline-block w-full max-w-2xl mx-auto">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-indigo-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>

      <div className="relative bg-[#0d0e22]/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Header ticker */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              {timeLeft.isStarted ? '🎉 Hackathon Is Live Now!' : 'Hackathon Starts In'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Sep 18, 09:00 AM IST</span>
          </div>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="w-full aspect-[4/3] sm:aspect-square bg-[#070814] border border-slate-800/90 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                {/* Subtle top neon stripe */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${unit.color}`}></div>
                
                <span className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white group-hover:scale-105 transition-transform duration-200">
                  {String(unit.value).padStart(2, '0')}
                </span>

                <div className="absolute bottom-1.5 text-[9px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  {unit.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtitle footer */}
        <div className="mt-5 pt-3 text-center border-t border-slate-800/60 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Registration closes on <strong className="text-slate-200">September 15, 2026</strong>. Free registration for all selected teams.</span>
        </div>
      </div>
    </div>
  );
};
