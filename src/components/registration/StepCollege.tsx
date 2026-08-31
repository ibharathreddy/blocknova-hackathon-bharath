import React from 'react';
import { School, MapPin, Building, Sparkles } from 'lucide-react';

interface StepCollegeProps {
  formData: {
    collegeName: string;
    collegeCity: string;
    collegeState: string;
  };
  updateFormData: (data: Partial<StepCollegeProps['formData']>) => void;
  errors: Record<string, string>;
}

const COMMON_COLLEGES = [
  'Vardhaman College of Engineering, Hyderabad',
  'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
  'VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)',
  'Vasavi College of Engineering, Hyderabad',
  'Gokaraju Rangaraju Institute of Engineering & Technology (GRIET)',
  'JNTUH University College of Engineering, Hyderabad',
  'University College of Engineering, Osmania University (OU)',
  'Mahatma Gandhi Institute of Technology (MGIT)',
  'CVR College of Engineering, Hyderabad',
  'Keshav Memorial Institute of Technology (KMIT)',
  'BVRIT Hyderabad College of Engineering for Women',
  'Sreenidhi Institute of Science and Technology (SNIST)'
];

export const StepCollege: React.FC<StepCollegeProps> = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <School className="w-5 h-5 text-purple-400" />
          <span>Step 1: College / Institution Details</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Tell us about the college or university representing your team. Cross-college teams can specify the primary team leader's institution.
        </p>
        <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
          <span><strong>Event Mode Note:</strong> Online mode for other colleges | Offline mode for Vardhaman College of Engineering.</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* College Name Input */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            College Name <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              list="college-suggestions"
              value={formData.collegeName}
              onChange={(e) => updateFormData({ collegeName: e.target.value })}
              placeholder="e.g. Vardhaman College of Engineering"
              className={`w-full px-4 py-3 bg-slate-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                errors.collegeName 
                  ? 'border-pink-500/80 focus:border-pink-400' 
                  : 'border-slate-800 focus:border-purple-500'
              }`}
            />
            <datalist id="college-suggestions">
              {COMMON_COLLEGES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          {errors.collegeName ? (
            <p className="text-xs text-pink-400 mt-1 font-medium">{errors.collegeName}</p>
          ) : (
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>You can type any college name or select from the dropdown suggestions.</span>
            </p>
          )}
        </div>

        {/* City & State Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              College City <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.collegeCity}
                onChange={(e) => updateFormData({ collegeCity: e.target.value })}
                placeholder="e.g. Hyderabad"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              College State <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.collegeState}
                onChange={(e) => updateFormData({ collegeState: e.target.value })}
                placeholder="e.g. Telangana"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
