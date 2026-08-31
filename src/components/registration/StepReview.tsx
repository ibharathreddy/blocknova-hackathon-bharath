import React from 'react';
import { 
  CheckCircle, 
  Edit, 
  ShieldCheck, 
  Building, 
  Users, 
  User, 
  Mail, 
  Phone, 
  Hash, 
  FileCode,
  AlertTriangle
} from 'lucide-react';
import { TeamLeader, TeamMember, TeamSize } from '../../types';

interface StepReviewProps {
  formData: {
    collegeName: string;
    collegeCity: string;
    collegeState: string;
    teamName: string;
    teamSize: TeamSize;
    problemStatementId: string;
    projectIdea: string;
    teamLeader: TeamLeader;
    members: TeamMember[];
  };
  confirmed: boolean;
  setConfirmed: (val: boolean) => void;
  onGoToStep: (step: number) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  formData,
  confirmed,
  setConfirmed,
  onGoToStep
}) => {
  const neededMemberCount = formData.teamSize - 1;
  const activeMembers = formData.members.slice(0, neededMemberCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Step 5: Review & Confirm Submission</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Please verify your team details before final submission. You can click "Edit" on any section to make adjustments.
        </p>
        <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
          <span><strong>Event Mode Note:</strong> Online mode for other colleges | Offline mode for Vardhaman College of Engineering.</span>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* Section 1: College & Team Overview */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h4 className="font-display font-bold text-sm text-cyan-300 flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>College & Team Details</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-mono">College Name:</span>
              <strong className="text-slate-200 text-sm">{formData.collegeName || 'Not specified'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">City / State:</span>
              <span className="text-slate-300">{formData.collegeCity || 'Hyderabad'}, {formData.collegeState || 'Telangana'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">Team Name:</span>
              <strong className="text-purple-300 text-sm font-display">{formData.teamName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">Team Composition:</span>
              <span className="text-emerald-300 font-semibold">{formData.teamSize} Members (Leader + {neededMemberCount})</span>
            </div>
            {formData.problemStatementId && (
              <div className="sm:col-span-2">
                <span className="text-slate-500 block font-mono">Selected Problem Statement:</span>
                <span className="text-cyan-300 font-mono font-medium">{formData.problemStatementId}</span>
              </div>
            )}
            {formData.projectIdea && (
              <div className="sm:col-span-2">
                <span className="text-slate-500 block font-mono">Project Concept:</span>
                <p className="text-slate-300 italic">"{formData.projectIdea}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Team Leader Details */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h4 className="font-display font-bold text-sm text-indigo-300 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Team Leader (Primary Contact)</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block font-mono">Full Name & Year:</span>
              <strong className="text-slate-200">{formData.teamLeader.name} ({formData.teamLeader.year})</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">Roll Number:</span>
              <span className="text-slate-300 font-mono">{formData.teamLeader.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">Department:</span>
              <span className="text-slate-300">{formData.teamLeader.department || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">Email / Phone:</span>
              <span className="text-slate-300">{formData.teamLeader.email} | {formData.teamLeader.phone}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Team Members */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h4 className="font-display font-bold text-sm text-emerald-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Team Members ({activeMembers.length})</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="space-y-3">
            {activeMembers.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-mono mr-2">#{idx + 1}</span>
                  <strong className="text-slate-200">{m.name}</strong>
                  <span className="text-slate-400 ml-2">({m.year})</span>
                </div>
                <div className="text-slate-400 font-mono">
                  <span>Roll: {m.rollNumber}</span>
                  <span className="mx-2">•</span>
                  <span>{m.department || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Checkbox Requirement */}
        <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-600/40">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <span className="text-xs text-slate-200 leading-relaxed select-none">
              <strong className="text-white block font-semibold mb-0.5">
                Official Declaration & Confirmation:
              </strong>
              I confirm that the information provided is accurate and all team members agree to participate in the BlockNova Hackathon on September 18–19, 2026 at Vardhaman College of Engineering, adhering to the competition rules and academic integrity guidelines.
            </span>
          </label>
        </div>

      </div>
    </div>
  );
};
