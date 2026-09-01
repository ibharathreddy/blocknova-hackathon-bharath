import React from 'react';
import { Users, AlertCircle, CheckCircle2, Layers, Lock, Unlock } from 'lucide-react';
import { TeamSize } from '../../types';
import { useRegistration } from '../../context/RegistrationContext';

interface StepTeamProps {
  formData: {
    teamName: string;
    teamSize: TeamSize;
    problemStatementId: string;
    projectIdea: string;
  };
  updateFormData: (data: Partial<StepTeamProps['formData']>) => void;
  errors: Record<string, string>;
}

export const StepTeam: React.FC<StepTeamProps> = ({ formData, updateFormData, errors }) => {
  const { problemStatements, isPSReleased, getPSSelectionStats, checkTeamNameAvailable } = useRegistration();

  const isNameAvailable = formData.teamName.trim().length >= 2 
    ? checkTeamNameAvailable(formData.teamName) 
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Step 2: Team Identity & Challenge Track</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Pick a memorable team name, configure your team size (2 to 4 members), and choose your problem statement track.
        </p>
        <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
          <span><strong>Event Mode Note:</strong> Online mode for other colleges | Offline mode for Vardhaman College of Engineering.</span>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* Team Name with Real-Time Validation */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Team Name <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) => updateFormData({ teamName: e.target.value })}
              placeholder="e.g. AlgoVanguard"
              className={`w-full pl-4 pr-10 py-3 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                errors.teamName
                  ? 'border-pink-500/80 focus:border-pink-400'
                  : isNameAvailable === true
                  ? 'border-emerald-500/80 focus:border-emerald-400'
                  : 'border-slate-800 focus:border-cyan-500'
              }`}
            />
            {formData.teamName.trim().length >= 2 && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {isNameAvailable ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-pink-400" />
                )}
              </div>
            )}
          </div>
          
          {errors.teamName ? (
            <p className="text-xs text-pink-400 mt-1 font-medium">{errors.teamName}</p>
          ) : isNameAvailable === false ? (
            <p className="text-xs text-pink-400 mt-1 font-medium">
              This team name is already registered. Please choose another name.
            </p>
          ) : isNameAvailable === true ? (
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>Team name is available!</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 mt-1">
              Must be 2–40 characters and unique across all institutions.
            </p>
          )}
        </div>

        {/* Team Size Selector (2, 3, 4) */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
            Select Team Size <span className="text-pink-400">*</span>
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {([2, 3, 4] as TeamSize[]).map((size) => {
              const isSelected = formData.teamSize === size;
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => updateFormData({ teamSize: size })}
                  className={`py-3 px-4 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-glow-purple ring-1 ring-purple-400'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-display font-black text-lg text-white mb-0.5">
                    {size} Members
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {size === 2 ? 'Leader + 1' : size === 3 ? 'Leader + 2' : 'Leader + 3'}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            The form dynamically updates team member fields according to your chosen size.
          </p>
        </div>

        {/* Problem Statement Track Selection Field (Only shown when released by Admin) */}
        {isPSReleased && (
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Problem Statement Track
            </label>

            <div className="space-y-2">
              <select
                value={formData.problemStatementId}
                onChange={(e) => updateFormData({ problemStatementId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="">Open Track (Decide Later / General)</option>
                <optgroup label="Standard Entry Projects">
                  {problemStatements.filter(p => p.category === 'Standard Entry Projects').map((ps) => {
                    const stats = getPSSelectionStats(ps.psId);
                    const isFull = stats.isFull && formData.problemStatementId !== ps.psId;
                    return (
                      <option key={ps.psId} value={ps.psId} disabled={isFull}>
                        {ps.psId}: {ps.title} ({stats.remaining} slots remaining){isFull ? ' - FULL' : ''}
                      </option>
                    );
                  })}
                </optgroup>
                <optgroup label="Composite Entry Projects">
                  {problemStatements.filter(p => p.category === 'Composite Entry Projects').map((ps) => {
                    const stats = getPSSelectionStats(ps.psId);
                    const isFull = stats.isFull && formData.problemStatementId !== ps.psId;
                    return (
                      <option key={ps.psId} value={ps.psId} disabled={isFull}>
                        {ps.psId}: {ps.title} ({stats.remaining} slots remaining){isFull ? ' - FULL' : ''}
                      </option>
                    );
                  })}
                </optgroup>
              </select>
              <p className="text-[11px] text-slate-400 font-mono">
                {formData.problemStatementId ? (
                  <span className="text-cyan-300">
                    Selected: {formData.problemStatementId} ({problemStatements.find(p => p.psId === formData.problemStatementId)?.title})
                  </span>
                ) : (
                  <span>You can also select or change your track anytime from your Team Leader dashboard after registering.</span>
                )}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
