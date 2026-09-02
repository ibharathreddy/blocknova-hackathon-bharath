import React from 'react';
import { UserPlus, User, Mail, Hash, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { TeamMember, TeamSize } from '../../types';

interface StepMembersProps {
  formData: {
    teamSize: TeamSize;
    members: TeamMember[];
  };
  updateFormData: (data: { members: TeamMember[] }) => void;
  errors: Record<string, string>;
}

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];
const DEPARTMENTS = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AI & ML)',
  'Data Science / Cyber Security',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering / Others'
];

export const StepMembers: React.FC<StepMembersProps> = ({ formData, updateFormData, errors }) => {
  const neededMemberCount = formData.teamSize - 1;

  const updateMemberField = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...formData.members];
    // Ensure array is big enough
    while (updated.length < neededMemberCount) {
      updated.push({
        id: `m_${updated.length + 1}`,
        name: '',
        year: '3rd Year',
        rollNumber: '',
        department: 'Computer Science and Engineering (CSE)',
        email: ''
      });
    }

    updated[index] = {
      ...updated[index],
      [field]: value
    };
    updateFormData({ members: updated });
  };

  // Prepare cards array up to neededMemberCount
  const memberSlots = Array.from({ length: neededMemberCount }, (_, i) => i);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-emerald-400" />
          <span>Step 4: Additional Team Members ({neededMemberCount} Required)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Based on your chosen team size of <strong className="text-cyan-300">{formData.teamSize} members</strong>, please enter details for Member 1{neededMemberCount > 1 ? ` to ${neededMemberCount}` : ''} (in addition to Team Leader).
        </p>
        <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
          <span><strong>Event Mode Note:</strong> Online mode for other colleges | Offline mode for Vardhaman College of Engineering.</span>
        </div>
      </div>

      <div className="space-y-6">
        {memberSlots.map((slotIndex) => {
          const member = formData.members[slotIndex] || {
            name: '',
            year: '3rd Year',
            rollNumber: '',
            department: 'Computer Science and Engineering (CSE)',
            email: ''
          };

          return (
            <div 
              key={slotIndex}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center justify-center text-xs font-mono font-bold">
                    {slotIndex + 1}
                  </span>
                  <h4 className="font-display font-bold text-base text-white">
                    Team Member {slotIndex + 1}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500 uppercase">
                  Member #{slotIndex + 2} of Team
                </span>
              </div>

              <div className="space-y-4">
                {/* Member Name */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Member Name <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMemberField(slotIndex, 'name', e.target.value)}
                      placeholder={`e.g. Member ${slotIndex + 1} Name`}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                        errors[`member.${slotIndex}.name`]
                          ? 'border-pink-500/80 focus:border-pink-400'
                          : 'border-slate-800 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors[`member.${slotIndex}.name`] && (
                    <p className="text-xs text-pink-400 mt-1 font-medium">{errors[`member.${slotIndex}.name`]}</p>
                  )}
                </div>

                {/* Year & Roll Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Academic Year <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={member.year}
                        onChange={(e) => updateMemberField(slotIndex, 'year', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-slate-100 focus:outline-none appearance-none cursor-pointer"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Roll Number / Student ID <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={member.rollNumber}
                        onChange={(e) => updateMemberField(slotIndex, 'rollNumber', e.target.value)}
                        placeholder="e.g. 22881A0504"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                          errors[`member.${slotIndex}.rollNumber`]
                            ? 'border-pink-500/80 focus:border-pink-400'
                            : 'border-slate-800 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    {errors[`member.${slotIndex}.rollNumber`] && (
                      <p className="text-xs text-pink-400 mt-1 font-medium">{errors[`member.${slotIndex}.rollNumber`]}</p>
                    )}
                  </div>
                </div>

                {/* Department & Member Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Department / Branch <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        list={`member-dept-${slotIndex}`}
                        value={member.department}
                        onChange={(e) => updateMemberField(slotIndex, 'department', e.target.value)}
                        placeholder="e.g. Computer Science"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                          errors[`member.${slotIndex}.department`]
                            ? 'border-pink-500/80 focus:border-pink-400'
                            : 'border-slate-800 focus:border-emerald-500'
                        }`}
                      />
                      <datalist id={`member-dept-${slotIndex}`}>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d} />
                        ))}
                      </datalist>
                    </div>
                    {errors[`member.${slotIndex}.department`] && (
                      <p className="text-xs text-pink-400 mt-1 font-medium">{errors[`member.${slotIndex}.department`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Member Email <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={member.email || ''}
                        onChange={(e) => updateMemberField(slotIndex, 'email', e.target.value)}
                        placeholder="e.g. member@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
