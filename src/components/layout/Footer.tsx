import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink,
  Heart
} from 'lucide-react';
import { EVENT_CONFIG } from '../../data/eventData';
import { AppView } from '../../types';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  setCurrentView: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, setCurrentView }) => {
  const quickLinks = [
    { label: 'Home', sectionId: 'hero', view: 'home' as AppView },
    { label: 'About BlockNova', sectionId: 'about', view: 'about' as AppView },
    { label: 'Schedule & Timeline', sectionId: 'schedule', view: 'schedule' as AppView },
    { label: 'Prizes & Rewards', sectionId: 'prizes', view: 'home' as AppView },
    { label: 'FAQ', sectionId: 'faq', view: 'faq' as AppView },
  ];

  const handleLink = (link: typeof quickLinks[0]) => {
    if (link.view !== 'home') {
      setCurrentView(link.view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView('home');
    setTimeout(() => {
      onNavigateSection(link.sectionId);
    }, 100);
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-[#060712] overflow-hidden pt-16 pb-12">
      {/* Background glow dots */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand & Organization Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-glow-purple">
                <div className="w-full h-full bg-[#0c0d1c] rounded-[10px] flex items-center justify-center font-display font-black text-cyan-300 text-lg">
                  ⚡
                </div>
              </div>
              <div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  BLOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">NOVA</span>
                </span>
                <span className="ml-2 px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  2026
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              BlockNova is a premier 36-hour national blockchain and deep-tech hackathon organized by the
              <strong className="text-slate-200"> Algorand Blockchain Club</strong> at <strong className="text-slate-200">Vardhaman College of Engineering</strong>, Hyderabad. Sponsored by the <strong className="text-cyan-400">Algorand Foundation</strong>.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={EVENT_CONFIG.socialLinks.x}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={EVENT_CONFIG.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={EVENT_CONFIG.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={EVENT_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.slice(0, 5).map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLink(link)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Event & Logistics Column */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Event Info
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.slice(5).map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLink(link)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setCurrentView('register');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 mt-1"
                >
                  Register Team <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
              Contact Us
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300 block">Vardhaman College of Engineering</strong>
                  Kacharam, Shamshabad, Hyderabad, Telangana 501218
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href={`mailto:${EVENT_CONFIG.contactEmail}`} className="hover:text-white transition-colors">
                  {EVENT_CONFIG.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${EVENT_CONFIG.contactPhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {EVENT_CONFIG.contactPhone}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 BlockNova Hackathon. Organized by Algorand Blockchain Club & Vardhaman College of Engineering.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Builders & Innovators
            </span>
            <span className="text-slate-600">|</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
