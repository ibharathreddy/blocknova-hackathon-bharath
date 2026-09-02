import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Download, 
  ArrowLeft, 
  MessageCircle, 
  Printer,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Users,
  ShieldCheck,
  Building
} from 'lucide-react';
import { RegistrationData } from '../../types';
import { downloadRegistrationPassPDF } from '../../utils/validation';
import { EVENT_CONFIG } from '../../data/eventData';

interface RegistrationSuccessProps {
  registration: RegistrationData;
  onBackToHome: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  registration,
  onBackToHome
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRegId, setCopiedRegId] = useState(false);

  const whatsappLink = EVENT_CONFIG.whatsappGroup || 'https://chat.whatsapp.com/E7YGVNKMgG452D0VkVmOI0?s=sh&p=a&mlu=4&ilr=4';

  useEffect(() => {
    // Fire festive cyber confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#00f2fe', '#f43f5e', '#3b82f6', '#10b981']
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whatsappLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyRegId = () => {
    navigator.clipboard.writeText(registration.registrationId);
    setCopiedRegId(true);
    setTimeout(() => setCopiedRegId(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in zoom-in-95 duration-300">
      
      {/* Glow Backdrop */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-emerald-500/40 relative overflow-hidden shadow-2xl bg-gradient-to-b from-[#0e1726] to-[#090b1c]">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500"></div>

        {/* Success Icon & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-glow-teal">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Registration Confirmed</span>
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1 mb-2">
            You're In, {registration.teamName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Your team registration has been successfully recorded for BlockNova 2026 at Vardhaman College of Engineering.
          </p>
        </div>

        {/* Registration ID Banner */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-center mb-6 relative overflow-hidden">
          <div className="text-xs font-mono text-purple-300 uppercase tracking-wider mb-1">
            Unique Registration Identifier
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 tracking-wider">
              {registration.registrationId}
            </span>
            <button
              type="button"
              onClick={handleCopyRegId}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Copy Registration ID"
            >
              {copiedRegId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Save this ID for check-in on Sep 18 and all organizer correspondence.
          </p>
        </div>

        {/* ================================================================ */}
        {/* OFFICIAL HACKER WHATSAPP GROUP CARD                               */}
        {/* ================================================================ */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-teal-950/80 border border-emerald-500/60 shadow-xl mb-6 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 shadow-glow-teal">
              <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base sm:text-lg text-white">
                  Join the Official Hackers WhatsApp Group
                </h3>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Follow this link to join the WhatsApp group for live hackathon announcements, desk allocations, mentor checkpoint alerts, and query resolution.
              </p>
            </div>
          </div>

          {/* WhatsApp Link Box & Action Buttons */}
          <div className="mt-4 pt-3 border-t border-emerald-800/50 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-teal transition-all group/btn"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Join BlockNova WhatsApp Group</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
                title="Copy WhatsApp Group Invite Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-emerald-300/80 font-mono bg-emerald-950/60 rounded-xl px-3 py-1.5 border border-emerald-800/40 truncate">
              {whatsappLink}
            </div>
          </div>
        </div>

        {/* Team Summary Box */}
        <div className="space-y-3 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 mb-6">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-500 font-mono">College:</span>
            <strong className="text-slate-200">{registration.collegeName}</strong>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-500 font-mono">Team Leader:</span>
            <span className="text-slate-200">{registration.teamLeader.name} ({registration.teamLeader.rollNumber})</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-500 font-mono">Team Size:</span>
            <span className="text-slate-200">{registration.teamSize} Members</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-500 font-mono">Leader Email:</span>
            <span className="text-cyan-300 font-mono">{registration.teamLeader.email}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 font-mono">Dates & Venue:</span>
            <span className="text-slate-200">Sep 18–19 @ Vardhaman College</span>
          </div>
        </div>

        {/* Primary Download & Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => downloadRegistrationPassPDF(registration)}
            className="w-full py-3.5 px-6 rounded-xl cyber-gradient-btn text-white font-display font-bold text-sm flex items-center justify-center gap-2.5 shadow-glow-purple group"
          >
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>Download Official Registration Pass (PDF)</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Open WhatsApp Group</span>
            </a>

            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center pt-2">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to BlockNova Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};
