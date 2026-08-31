import React from 'react';
import { User, Mail, Phone, Hash, BookOpen, GraduationCap } from 'lucide-react';
import { TeamLeader } from '../../types';

interface StepLeaderProps {
  formData: {
    teamLeader: TeamLeader;
  };
  updateFormData: (data: { teamLeader: TeamLeader }) => void;
  errors: Record<string, string>;
}

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate / Alumni'];
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

export const StepLeader: React.FC<StepLeaderProps> = ({ formData, updateFormData, errors }) => {
  const leader = formData.teamLeader;

  const updateLeader = (field: keyof TeamLeader, value: string) => {
    updateFormData({
      teamLeader: {
        ...leader,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>Step 3: Team Leader Information</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          The team leader serves as the primary contact person for hackathon updates, check-in badges, and prize disbursement.
        </p>
        <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
          <span><strong>Event Mode Note:</strong> Online mode for other colleges | Offline mode for Vardhaman College of Engineering.</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Leader Full Name <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={leader.name}
              onChange={(e) => updateLeader('name', e.target.value)}
              placeholder="e.g. Bharath Reddy"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                errors['leader.name']
                  ? 'border-pink-500/80 focus:border-pink-400'
                  : 'border-slate-800 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors['leader.name'] && (
            <p className="text-xs text-pink-400 mt-1 font-medium">{errors['leader.name']}</p>
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
                value={leader.year}
                onChange={(e) => updateLeader('year', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none appearance-none cursor-pointer"
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
                value={leader.rollNumber}
                onChange={(e) => updateLeader('rollNumber', e.target.value)}
                placeholder="e.g. 22881A0512"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                  errors['leader.rollNumber']
                    ? 'border-pink-500/80 focus:border-pink-400'
                    : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors['leader.rollNumber'] && (
              <p className="text-xs text-pink-400 mt-1 font-medium">{errors['leader.rollNumber']}</p>
            )}
          </div>
        </div>

        {/* Department / Branch */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Department / Branch <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              list="leader-dept-list"
              value={leader.department}
              onChange={(e) => updateLeader('department', e.target.value)}
              placeholder="e.g. Computer Science and Engineering"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                errors['leader.department']
                  ? 'border-pink-500/80 focus:border-pink-400'
                  : 'border-slate-800 focus:border-indigo-500'
              }`}
            />
            <datalist id="leader-dept-list">
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          {errors['leader.department'] && (
            <p className="text-xs text-pink-400 mt-1 font-medium">{errors['leader.department']}</p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={leader.email}
                onChange={(e) => updateLeader('email', e.target.value)}
                placeholder="e.g. leader@gmail.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                  errors['leader.email']
                    ? 'border-pink-500/80 focus:border-pink-400'
                    : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors['leader.email'] && (
              <p className="text-xs text-pink-400 mt-1 font-medium">{errors['leader.email']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Phone Number <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={leader.phone}
                onChange={(e) => updateLeader('phone', e.target.value)}
                placeholder="e.g. 9876543210"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                  errors['leader.phone']
                    ? 'border-pink-500/80 focus:border-pink-400'
                    : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors['leader.phone'] && (
              <p className="text-xs text-pink-400 mt-1 font-medium">{errors['leader.phone']}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
