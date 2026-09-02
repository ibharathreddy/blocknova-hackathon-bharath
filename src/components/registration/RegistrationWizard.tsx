import React, { useState } from 'react';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  AlertCircle,
  Building,
  Users,
  User,
  Send
} from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { TeamSize, TeamLeader, TeamMember } from '../../types';
import { isValidEmail, isValidPhone, isValidRollNumber, isRollNumberRegistered } from '../../utils/validation';
import { StepCollege } from './StepCollege';
import { StepTeam } from './StepTeam';
import { StepLeader } from './StepLeader';
import { StepMembers } from './StepMembers';
import { StepReview } from './StepReview';
import { RegistrationSuccess } from './RegistrationSuccess';

interface RegistrationWizardProps {
  onBackToHome: () => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onBackToHome }) => {
  const { 
    registrations,
    submitRegistration, 
    checkTeamNameAvailable, 
    selectedPSForRegistration,
    setSelectedPSForRegistration,
    getRegistrationById
  } = useRegistration();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [submissionSuccessId, setSubmissionSuccessId] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Unified Form State
  const [formData, setFormData] = useState({
    collegeName: 'Vardhaman College of Engineering',
    collegeCity: 'Hyderabad',
    collegeState: 'Telangana',
    teamName: '',
    teamSize: 4 as TeamSize,
    problemStatementId: selectedPSForRegistration || '',
    projectIdea: '',
    teamLeader: {
      name: '',
      year: '3rd Year',
      rollNumber: '',
      department: 'Computer Science and Engineering',
      email: '',
      phone: ''
    } as TeamLeader,
    members: [
      { id: 'm1', name: '', year: '3rd Year', rollNumber: '', department: 'Computer Science and Engineering', email: '' },
      { id: 'm2', name: '', year: '3rd Year', rollNumber: '', department: 'Information Technology', email: '' },
      { id: 'm3', name: '', year: '2nd Year', rollNumber: '', department: 'AI & Machine Learning', email: '' }
    ] as TeamMember[]
  });

  // Sync problem statement selection if user selected it externally
  React.useEffect(() => {
    if (selectedPSForRegistration) {
      setFormData(prev => ({ ...prev, problemStatementId: selectedPSForRegistration }));
    }
  }, [selectedPSForRegistration]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setGeneralError(null);
  };

  const steps = [
    { num: 1, title: 'College', icon: Building },
    { num: 2, title: 'Team', icon: Users },
    { num: 3, title: 'Leader', icon: User },
    { num: 4, title: 'Members', icon: UserPlus },
    { num: 5, title: 'Review', icon: ShieldCheck },
  ];

  // Step Validations
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.collegeName.trim()) {
        newErrors.collegeName = 'College name is required.';
      } else if (formData.collegeName.trim().length < 2) {
        newErrors.collegeName = 'College name must be at least 2 characters.';
      }
    }

    if (currentStep === 2) {
      if (!formData.teamName.trim()) {
        newErrors.teamName = 'Team name is required.';
      } else if (formData.teamName.trim().length < 2) {
        newErrors.teamName = 'Team name must be at least 2 characters.';
      } else if (!checkTeamNameAvailable(formData.teamName)) {
        newErrors.teamName = 'This team name is already registered. Please choose another name.';
      }
    }

    if (currentStep === 3) {
      if (!formData.teamLeader.name.trim()) {
        newErrors['leader.name'] = 'Leader name is required.';
      }
      if (!isValidRollNumber(formData.teamLeader.rollNumber)) {
        newErrors['leader.rollNumber'] = 'Valid roll number is required.';
      } else {
        const check = isRollNumberRegistered(formData.teamLeader.rollNumber, registrations);
        if (check.isDuplicate) {
          newErrors['leader.rollNumber'] = `Roll number is already registered under team "${check.registeredTeam}".`;
        }
      }
      if (!formData.teamLeader.department.trim()) {
        newErrors['leader.department'] = 'Department is required.';
      }
      if (!isValidEmail(formData.teamLeader.email)) {
        newErrors['leader.email'] = 'Please enter a valid email address (e.g. name@domain.com).';
      }
      if (!isValidPhone(formData.teamLeader.phone)) {
        newErrors['leader.phone'] = 'Please enter a valid 10-digit phone number.';
      }
    }

    if (currentStep === 4) {
      const neededCount = formData.teamSize - 1;
      const seenRolls = new Set<string>();
      const leaderRoll = formData.teamLeader.rollNumber.trim().toUpperCase();
      if (leaderRoll) {
        seenRolls.add(leaderRoll);
      }

      for (let i = 0; i < neededCount; i++) {
        const m = formData.members[i];
        if (!m || !m.name.trim()) {
          newErrors[`member.${i}.name`] = `Member ${i + 1} name is required.`;
        }
        if (!m || !isValidRollNumber(m.rollNumber)) {
          newErrors[`member.${i}.rollNumber`] = `Member ${i + 1} roll number is required.`;
        } else {
          const mRoll = m.rollNumber.trim().toUpperCase();
          if (mRoll === leaderRoll) {
            newErrors[`member.${i}.rollNumber`] = `Roll number cannot match the Team Leader's roll number.`;
          } else if (seenRolls.has(mRoll)) {
            newErrors[`member.${i}.rollNumber`] = `Duplicate roll number within the same team.`;
          } else {
            seenRolls.add(mRoll);
            const check = isRollNumberRegistered(m.rollNumber, registrations);
            if (check.isDuplicate) {
              newErrors[`member.${i}.rollNumber`] = `Roll number is already registered under team "${check.registeredTeam}".`;
            }
          }
        }
        if (!m || !m.department.trim()) {
          newErrors[`member.${i}.department`] = `Member ${i + 1} department is required.`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleGoToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setGeneralError('Please check the confirmation box to confirm your team details.');
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const neededMembers = formData.members.slice(0, formData.teamSize - 1);

      const result = await submitRegistration({
        collegeName: formData.collegeName,
        collegeCity: formData.collegeCity,
        collegeState: formData.collegeState,
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        teamLeader: formData.teamLeader,
        members: neededMembers,
        problemStatementId: formData.problemStatementId || undefined,
        projectIdea: formData.projectIdea || undefined
      });

      if (result.success && result.registrationId) {
        setSubmissionSuccessId(result.registrationId);
        setSelectedPSForRegistration(null);
        window.scrollTo({ top: 60, behavior: 'smooth' });
      } else {
        setGeneralError(result.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err: any) {
      setGeneralError(err.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully submitted, show confirmation view
  if (submissionSuccessId) {
    const reg = getRegistrationById(submissionSuccessId);
    if (reg) {
      return <RegistrationSuccess registration={reg} onBackToHome={onBackToHome} />;
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Top Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/60 text-purple-300 text-xs font-mono mb-3">
          <UserPlus className="w-3.5 h-3.5" />
          <span>TEAM REGISTRATION PORTAL</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Register for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">BlockNova 2026</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enforce 2–4 members per team. Takes only 3 minutes to complete.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-8">
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            const Icon = step.icon;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  if (isDone) handleGoToStep(step.num);
                }}
                disabled={!isDone && !isCurrent}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-purple-950/70 border border-purple-500/80 text-white'
                    : isDone
                    ? 'bg-slate-900/60 border border-emerald-500/40 text-emerald-400 cursor-pointer hover:bg-slate-800'
                    : 'bg-slate-900/30 border border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mb-1 ${
                  isDone
                    ? 'bg-emerald-900/80 text-emerald-300'
                    : isCurrent
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span className="text-[10px] sm:text-xs font-mono font-medium hidden sm:flex items-center gap-1">
                  <Icon className="w-3 h-3" />
                  <span>{step.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative shadow-2xl">
        
        {generalError && (
          <div className="mb-6 p-4 rounded-xl bg-pink-950/60 border border-pink-700/60 text-pink-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          {currentStep === 1 && (
            <StepCollege
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <StepTeam
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <StepLeader
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <StepMembers
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {currentStep === 5 && (
            <StepReview
              formData={formData}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              onGoToStep={handleGoToStep}
            />
          )}

          {/* Navigation Controls Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-slate-800 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl cyber-gradient-btn text-white font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-glow-purple"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!confirmed || isSubmitting}
                className={`px-8 py-3 rounded-xl font-display font-bold text-sm flex items-center gap-2.5 transition-all ${
                  confirmed && !isSubmitting
                    ? 'cyber-gradient-btn text-white shadow-glow-purple cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to Cloud...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Registration</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

      </div>

    </div>
  );
};
