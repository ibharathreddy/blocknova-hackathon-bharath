import React from 'react';
import {
  Rocket,
  Network,
  Award,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Coins,
  Users,
  Code2
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const perks = [
    {
      icon: Rocket,
      title: 'Build Real-World Solutions',
      description: 'Go beyond toy prototypes. Develop deployable decentralized dApps addressing genuine industry challenges.',
      color: 'text-purple-400',
      bg: 'bg-purple-950/40 border-purple-800/40'
    },
    {
      icon: Cpu,
      title: 'Algorand & Deep Tech Focus',
      description: 'Leverage Algorand’s carbon-negative Layer-1 blockchain, PyTeal, AlgoKit, and AI models.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/40 border-cyan-800/40'
    },
    {
      icon: Network,
      title: 'Mentorship & Networking',
      description: 'Receive 1-on-1 architecture reviews and guidance from Algorand ecosystem engineers.',
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/40 border-indigo-800/40'
    },
    {
      icon: Coins,
      title: '₹1 Lakh+ Cash & Grants',
      description: 'Compete for ₹1,00,000+ in direct cash prizes, plus access to Algorand developer grants.',
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/40'
    },
    {
      icon: Award,
      title: 'Accredited Certificates & Swag',
      description: 'All participants receive official verifiable certificates, swag, and developer credits.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/40'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Registration Fee',
      description: '100% free participation. Please note: No food and no accommodation will be provided.',
      color: 'text-pink-400',
      bg: 'bg-pink-950/40 border-pink-800/40'
    }
  ];

  const eligibilityList = [
    'Enrolled college students from any recognized institution in India.',
    'Event Mode: Online for other colleges, Offline for Vardhaman College students.',
    'Teams must have 2 to 4 members.',
    'Cross-college and cross-department collaboration is allowed.',
    'Open to developers, UI/UX designers, and tech enthusiasts of all skill levels.'
  ];

  return (
    <section id="about" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>ABOUT THE HACKATHON</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-3">
            About BlockNova 2026
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            BlockNova 2026 is a hackathon organized by the <strong className="text-slate-200">Algorand Blockchain Club</strong> at <strong className="text-slate-200">Vardhaman College of Engineering</strong>, Hyderabad, sponsored by <strong className="text-cyan-400">Algorand</strong>.
          </p>
        </div>

        {/* Who Can Join Card */}
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/20 relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-600/50 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">Who Can Join?</h3>
              <p className="text-xs font-mono text-cyan-300">Open to all aspiring creators</p>
            </div>
          </div>

          <ul className="space-y-3.5">
            {eligibilityList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-slate-400 block font-mono">Team Size</span>
              <span className="font-bold text-white text-sm">2 to 4 Members</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Mode</span>
              <span className="font-bold text-cyan-300 text-sm">Online (Other Colleges) / Offline (Vardhaman)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Registration Fee</span>
              <span className="font-bold text-emerald-400 text-sm">₹0 (Free Entry)</span>
            </div>
          </div>
        </div>

        {/* Why Participate Grid */}
        <div className="mb-4">
          <h3 className="font-display font-bold text-xl sm:text-2xl text-white text-center mb-8">
            Why You Should Participate in BlockNova
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className={`glass-card-hover rounded-2xl p-6 border ${perk.bg} flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center mb-4 ${perk.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-white mb-2">{perk.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{perk.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

