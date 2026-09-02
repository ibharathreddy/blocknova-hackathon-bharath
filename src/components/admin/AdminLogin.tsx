import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const { loginAdmin } = useRegistration();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the organizer passcode.');
      return;
    }

    const success = loginAdmin(password, email || 'admin@vardhaman.org');
    if (success) {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Invalid organizer credentials. Please verify your passcode and try again.');
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

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          data-form-type="other"
        >
          {/* Invisible decoy inputs to absorb browser password autofill */}
          <input
            type="text"
            name="prevent_autofill_admin_decoy"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }}
          />
          <input
            type="password"
            name="prevent_autofill_admin_pwd_decoy"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }}
          />

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              name="bn_admin_email_field"
              id="bn_admin_email_field"
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              data-form-type="other"
              readOnly
              onFocus={(e) => { e.currentTarget.readOnly = false; }}
              onPointerDown={(e) => { e.currentTarget.readOnly = false; }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@vardhaman.org"
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
              Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="bn_admin_passcode_field"
                id="bn_admin_passcode_field"
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                data-form-type="other"
                readOnly
                onFocus={(e) => { e.currentTarget.readOnly = false; }}
                onPointerDown={(e) => { e.currentTarget.readOnly = false; }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full pl-4 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
