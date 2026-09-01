import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const { loginAdmin } = useRegistration();
  const [email, setEmail] = useState('blockchain@vardhaman.org');
  const [password, setPassword] = useState('blocknova2028');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin passcode.');
      return;
    }

    const success = loginAdmin(password, email);
    if (success) {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Invalid admin credentials. Use demo passcode');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 animate-in fade-in duration-200">
      <div className="glass-card rounded-3xl p-8 border border-purple-500/30 relative shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-600/50 flex items-center justify-center mx-auto mb-4 text-purple-300 shadow-glow-purple">
          <KeyRound className="w-6 h-6" />
        </div>

        <h2 className="font-display font-black text-2xl text-white text-center mb-1">
          Organizer Portal
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          Authorized access for Vardhaman College & Algorand Club admins.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-pink-950/60 border border-pink-700/60 text-pink-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono"
            />
          </div>

          {/* Quick Demo Credentials Help */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span className="text-purple-300 font-bold block mb-0.5">Demo Passcode:</span>
            <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded mr-2">blocknova2026</code>
            or <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded ml-1">admin123</code>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl cyber-gradient-btn text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple"
          >
            <Lock className="w-4 h-4" />
            <span>Authenticate to Dashboard</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
