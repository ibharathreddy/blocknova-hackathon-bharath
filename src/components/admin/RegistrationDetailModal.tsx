import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Save, 
  User, 
  Users, 
  Building, 
  FileCode, 
  Phone, 
  Mail, 
  Calendar 
} from 'lucide-react';
import { RegistrationData, RegistrationStatus } from '../../types';
import { downloadRegistrationPassPDF } from '../../utils/validation';

interface RegistrationDetailModalProps {
  registration: RegistrationData | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: RegistrationStatus, notes?: string) => void;
  onDelete: (id: string) => void;
}

export const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({
  registration,
  onClose,
  onUpdateStatus,
  onDelete
}) => {
  if (!registration) return null;

  const [adminNotes, setAdminNotes] = useState<string>(registration.adminNotes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateStatus(registration.registrationId, registration.status, adminNotes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0d0e22] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-cyan-300 text-sm bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                {registration.registrationId}
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white">
              {registration.teamName}
            </h3>
            <p className="text-xs text-slate-400">
              {registration.collegeName} • {registration.collegeCity || 'Hyderabad'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="space-y-6 overflow-y-auto py-5 pr-1 text-xs sm:text-sm text-slate-300">
          
          {/* Admin Review Notes Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Admin Review & Verification Notes
            </label>

            <div>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Verified student identity card / bay assigned"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl cyber-gradient-btn text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Notes Saved!' : 'Save Notes'}</span>
              </button>
            </div>
          </div>

          {/* Team Leader Dossier */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              Team Leader Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block font-mono">Name & Year:</span>
                <strong className="text-slate-200">{registration.teamLeader.name} ({registration.teamLeader.year})</strong>
              </div>
              <div>
                <span className="text-slate-500 block font-mono">Roll Number:</span>
                <span className="text-slate-200 font-mono">{registration.teamLeader.rollNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-mono">Department:</span>
                <span className="text-slate-300">{registration.teamLeader.department || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-mono">Contact:</span>
                <span className="text-cyan-300">{registration.teamLeader.email} | {registration.teamLeader.phone}</span>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Team Members ({registration.members.length})
            </h4>
            <div className="space-y-2">
              {registration.members.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-slate-500 font-mono mr-1">#{idx + 1}</span>
                    <strong className="text-slate-200">{m.name}</strong>
                    <span className="text-slate-400 ml-2">({m.year})</span>
                  </div>
                  <div className="text-slate-400 font-mono">
                    <span>{m.rollNumber}</span>
                    <span className="mx-1.5">•</span>
                    <span>{m.department || 'N/A'}</span>
                    {m.email && <span className="ml-2 text-slate-500 font-normal">({m.email})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Statement & Concept */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <FileCode className="w-4 h-4 text-purple-400" />
              <strong className="text-purple-300 font-mono uppercase">Problem Statement & Track</strong>
            </div>
            <div className="mb-2">
              <span className="text-slate-400 font-mono">Track: </span>
              <span className="text-cyan-300 font-semibold">{registration.problemStatementId || 'Open Track / General'}</span>
            </div>
            {registration.projectIdea && (
              <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 italic">
                "{registration.projectIdea}"
              </p>
            )}
          </div>

          {/* Audit Timestamps */}
          <div className="text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <span>Created: {new Date(registration.createdAt).toLocaleString('en-IN')}</span>
            <span>Last Updated: {new Date(registration.updatedAt).toLocaleString('en-IN')}</span>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to delete registration ${registration.registrationId}?`)) {
                onDelete(registration.registrationId);
                onClose();
              }
            }}
            className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/50 hover:border-rose-800 border border-transparent text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Team</span>
          </button>

          <button
            type="button"
            onClick={() => downloadRegistrationPassPDF(registration)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Pass</span>
          </button>
        </div>

      </div>
    </div>
  );
};
