import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
  HelpCircle,
  FileText,
  UserPlus,
  LogIn,
  User,
  ShieldAlert
} from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { AppView } from '../../types';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onNavigateSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdminAuthenticated, currentUser, loggedInTeam, isPSReleased } = useRegistration();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: Array<{ label: string; sectionId: string; view: AppView; icon: any }> = [
    { label: 'Home', sectionId: 'hero', view: 'home', icon: Sparkles },
    { label: 'About', sectionId: 'about', view: 'about', icon: ShieldCheck },
    { label: 'Problem Statements', sectionId: 'problem-statements', view: 'home', icon: FileText },
    { label: 'Event Schedule', sectionId: 'schedule', view: 'schedule', icon: Layers },
    { label: 'FAQ', sectionId: 'faq', view: 'faq', icon: HelpCircle },
  ];

  const handleNavClick = (sectionId: string, view: AppView) => {
    setMobileMenuOpen(false);
    if (view !== 'home') {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        onNavigateSection(sectionId);
      }, 100);
    } else {
      onNavigateSection(sectionId);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen ? 'glass-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand Logo & Club Subtitle */}
          <button
            onClick={() => handleNavClick('hero', 'home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-glow-purple group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0c0d1c] rounded-[10px] flex items-center justify-center font-display font-black text-cyan-300 text-lg">
                ⚡
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  BLOCK<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">NOVA</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
                <span>Algorand Blockchain Club</span>
                <span className="text-purple-400">•</span>
                <span className="text-slate-400">VCE</span>
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = (currentView === item.view && item.view !== 'home') || (currentView === 'home' && item.sectionId === 'hero');
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.sectionId, item.view)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  currentView === 'admin'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-purple-950/80 border border-purple-800/80 text-purple-300 hover:bg-purple-900/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Action CTAs: Login & Register */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Login / Portal Button */}
            <button
              onClick={() => {
                setCurrentView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 border transition-all ${
                currentView === 'login'
                  ? 'bg-purple-900/50 border-purple-500 text-cyan-300 shadow-glow-purple'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {loggedInTeam || currentUser ? (
                <>
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="max-w-[120px] truncate">
                    {loggedInTeam?.teamLeader.name || currentUser?.displayName || 'Team Leader'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Register CTA */}
            <button
              onClick={() => {
                setCurrentView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative flex items-center gap-2 px-4 py-2 rounded-[11px] bg-[#0c0d1e] text-white group-hover:bg-opacity-90 transition-all font-display text-xs sm:text-sm tracking-wide shadow-glow-purple">
                <UserPlus className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Register Now</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                setCurrentView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium font-display flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Login</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold font-display shadow-sm"
            >
              Register
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#090a18]/95 backdrop-blur-2xl border-b border-slate-800/80 px-5 py-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.sectionId, item.view)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium text-slate-200 hover:text-white hover:bg-purple-900/30 transition-colors"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium text-purple-300 bg-purple-950/60 border border-purple-800/60 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-display font-bold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>{loggedInTeam ? loggedInTeam.teamLeader.name : (currentUser ? 'My Account / Portal' : 'Team Leader Login')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 px-4 rounded-xl cyber-gradient-btn text-white font-display font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Your Team</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
