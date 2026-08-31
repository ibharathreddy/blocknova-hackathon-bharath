import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  KeyRound,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  LogOut,
  UserPlus,
  ArrowRight,
  Download,
  Building,
  Users,
  Copy,
  Check,
  Database,
  Edit3,
  Trash2,
  Plus,
  Save,
  X
} from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { downloadRegistrationPassPDF } from '../../utils/validation';
import { RegistrationData, TeamMember, TeamSize } from '../../types';

interface LoginPageProps {
  onBackToHome: () => void;
  onNavigateToRegister: () => void;
  onNavigateToAdmin: () => void;
}

type TabType = 'leader' | 'admin';

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'AI & Machine Learning',
  'Data Science',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onNavigateToRegister,
  onNavigateToAdmin
}) => {
  const {
    loggedInTeam,
    loginTeamLeader,
    logoutTeamLeader,
    updateTeamRegistration,
    loginAdmin,
    isAdminAuthenticated,
    isFirebaseSyncing
  } = useRegistration();

  const [activeTab, setActiveTab] = useState<TabType>('leader');

  // Team Leader Login Form
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderNamePassword, setLeaderNamePassword] = useState('');

  // Admin Form
  const [adminPassword, setAdminPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@vardhaman.org');

  // Team Edit State
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamSize, setEditTeamSize] = useState<TeamSize>(2);
  const [editMembers, setEditMembers] = useState<TeamMember[]>([]);
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync edit state whenever loggedInTeam changes
  useEffect(() => {
    if (loggedInTeam) {
      setEditTeamSize(loggedInTeam.teamSize);
      setEditMembers([...loggedInTeam.members]);
    }
  }, [loggedInTeam]);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Handle Team Leader Login
  const handleLeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!leaderEmail.trim() || !leaderNamePassword.trim()) {
      setErrorMsg('Please enter both Team Leader Email and Team Leader Name (as password).');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginTeamLeader(leaderEmail, leaderNamePassword);
      setIsLoading(false);

      if (res.success) {
        setSuccessMsg(`Welcome, ${res.team?.teamLeader.name}! Team dashboard loaded.`);
      } else {
        setErrorMsg(
          res.error || 'Invalid credentials. Use your registered Team Leader Email and Team Leader Name.'
        );
      }
    }, 400);
  };

  // Handle Organizer Admin Login
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!adminPassword.trim()) {
      setErrorMsg('Please enter the organizer passcode.');
      return;
    }

    const ok = loginAdmin(adminPassword, adminEmail);
    if (ok) {
      onNavigateToAdmin();
    } else {
      setErrorMsg('Invalid organizer passcode. Demo passcodes: "blocknova2026" or "admin123"');
    }
  };

  const handleCopyRegId = (regId: string) => {
    navigator.clipboard.writeText(regId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Team Size & Member Management Handlers
  const handleTeamSizeChange = (newSize: TeamSize) => {
    if (newSize < 2 || newSize > 4) return;
    setEditTeamSize(newSize);

    const neededMembersCount = newSize - 1;
    if (editMembers.length < neededMembersCount) {
      // Add member slots up to needed count
      const additional: TeamMember[] = [];
      for (let i = editMembers.length; i < neededMembersCount; i++) {
        additional.push({
          id: `m_${i + 1}_${Date.now()}`,
          name: '',
          rollNumber: '',
          department: 'Computer Science and Engineering',
          year: '3rd Year',
          email: ''
        });
      }
      setEditMembers([...editMembers, ...additional]);
    } else if (editMembers.length > neededMembersCount) {
      // Slice down to needed count
      setEditMembers(editMembers.slice(0, neededMembersCount));
    }
  };

  const handleAddMember = () => {
    if (editTeamSize >= 4) {
      setErrorMsg('Maximum team size is 4 members (1 Leader + 3 Members).');
      return;
    }
    const nextSize = (editTeamSize + 1) as TeamSize;
    setEditTeamSize(nextSize);
    setEditMembers(prev => [
      ...prev,
      {
        id: `m_${prev.length + 1}_${Date.now()}`,
        name: '',
        rollNumber: '',
        department: 'Computer Science and Engineering',
        year: '3rd Year',
        email: ''
      }
    ]);
  };

  const handleRemoveMember = (indexToRemove: number) => {
    if (editTeamSize <= 2) {
      setErrorMsg('Minimum team size is 2 members (1 Leader + 1 Member). Cannot remove further.');
      return;
    }
    const updated = editMembers.filter((_, idx) => idx !== indexToRemove);
    const nextSize = (editTeamSize - 1) as TeamSize;
    setEditTeamSize(nextSize);
    setEditMembers(updated);
    clearMessages();
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setEditMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveTeamEdits = async () => {
    if (!loggedInTeam) return;
    clearMessages();

    // Validate Team Size
    if (editTeamSize < 2 || editTeamSize > 4) {
      setErrorMsg('Team size must be between 2 and 4 members (min 1 leader + 1 member, max 1 leader + 3 members).');
      return;
    }

    if (editMembers.length !== editTeamSize - 1) {
      setErrorMsg(`Please configure exactly ${editTeamSize - 1} team members for a team of ${editTeamSize}.`);
      return;
    }

    // Validate fields
    for (let i = 0; i < editMembers.length; i++) {
      const m = editMembers[i];
      if (!m.name.trim()) {
        setErrorMsg(`Member #${i + 1} name is required.`);
        return;
      }
      if (!m.rollNumber.trim()) {
        setErrorMsg(`Member #${i + 1} roll number is required.`);
        return;
      }
      if (!m.department.trim()) {
        setErrorMsg(`Member #${i + 1} department is required.`);
        return;
      }
    }

    setIsSavingTeam(true);

    const updatedRegistration: RegistrationData = {
      ...loggedInTeam,
      teamSize: editTeamSize,
      members: editMembers
    };

    const res = await updateTeamRegistration(updatedRegistration);
    setIsSavingTeam(false);

    if (res.success) {
      setSuccessMsg('Team members and team size updated successfully!');
      setIsEditingTeam(false);
    } else {
      setErrorMsg(res.error || 'Failed to update team details.');
    }
  };

  const handleCancelTeamEdits = () => {
    if (loggedInTeam) {
      setEditTeamSize(loggedInTeam.teamSize);
      setEditMembers([...loggedInTeam.members]);
    }
    setIsEditingTeam(false);
    clearMessages();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-mono mb-3 shadow-glow-purple">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>BLOCKNOVA AUTHENTICATION PORTAL</span>
          {isFirebaseSyncing && (
            <span className="flex items-center gap-1 text-[10px] text-cyan-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Live Sync
            </span>
          )}
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Participant & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Leader Login</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Access your team registration dashboard using your registered Team Leader Email and Name.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 relative shadow-2xl overflow-hidden">
        
        {/* Navigation Tabs (Team Leader vs Organizer) */}
        {!loggedInTeam && (
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-8 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('leader');
                clearMessages();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === 'leader'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Team Leader Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                clearMessages();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-800 to-slate-900 border border-purple-500/40 text-purple-200'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Organizer Access</span>
            </button>
          </div>
        )}

        {/* Global Feedback Banners */}
        {errorMsg && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-pink-950/70 border border-pink-700/60 text-pink-200 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-pink-400" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-200 text-xs flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div className="flex-1">{successMsg}</div>
          </div>
        )}

        {/* LOGGED IN: TEAM LEADER DASHBOARD */}
        {loggedInTeam ? (
          <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
            {/* Top Team Header Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/60 to-slate-950/80 border border-purple-500/40 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <span>{loggedInTeam.registrationId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyRegId(loggedInTeam.registrationId)}
                        className="text-cyan-400 hover:text-white"
                        title="Copy Registration ID"
                      >
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                    {loggedInTeam.teamName}
                  </h2>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{loggedInTeam.collegeName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{loggedInTeam.collegeCity || 'Hyderabad'}</span>
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => downloadRegistrationPassPDF(loggedInTeam)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Pass</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={logoutTeamLeader}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-pink-400 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Team Leader & Problem Statement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Team Leader Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                    Team Leader (Logged In)
                  </span>
                  <span className="text-xs font-mono text-slate-400">{loggedInTeam.teamLeader.year}</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    {loggedInTeam.teamLeader.name}
                  </h4>
                  <p className="text-xs text-slate-300 font-mono">{loggedInTeam.teamLeader.rollNumber}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <div>Department: <span className="text-slate-200">{loggedInTeam.teamLeader.department}</span></div>
                  <div>Email: <span className="text-cyan-300 font-mono text-[11px]">{loggedInTeam.teamLeader.email}</span></div>
                  <div>Phone: <span className="text-slate-200 font-mono text-[11px]">{loggedInTeam.teamLeader.phone}</span></div>
                </div>
              </div>

              {/* Problem Statement Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  Track / Problem Statement
                </span>
                <h4 className="font-display font-bold text-sm text-white">
                  {loggedInTeam.problemStatementId ? `Statement ID: ${loggedInTeam.problemStatementId}` : 'Open Innovation Track'}
                </h4>
                {loggedInTeam.projectIdea && (
                  <p className="text-xs text-slate-300 line-clamp-3 italic">
                    "{loggedInTeam.projectIdea}"
                  </p>
                )}
                <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                  Registered on: {new Date(loggedInTeam.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* TEAM MEMBERS MANAGEMENT & EDITING SECTION */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Team Members & Size Management</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Team size must be between <strong className="text-cyan-300 font-mono">2 and 4</strong> members total (including Leader).
                  </p>
                </div>

                {!isEditingTeam ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTeam(true);
                      clearMessages();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/80 hover:bg-purple-900 text-purple-200 text-xs font-bold font-display flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Manage Members & Size</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelTeamEdits}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSavingTeam}
                      onClick={handleSaveTeamEdits}
                      className="px-4 py-1.5 rounded-xl cyber-gradient-btn text-white text-xs font-bold flex items-center gap-1.5 shadow-glow-purple"
                    >
                      {isSavingTeam ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* READ-ONLY MEMBERS VIEW */}
              {!isEditingTeam ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Total Team Size: <strong className="text-cyan-300 font-bold">{loggedInTeam.teamSize} Members</strong> (1 Leader + {loggedInTeam.members.length} Members)</span>
                    <span className="text-[11px] text-purple-300">Min 2 • Max 4</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {loggedInTeam.members.map((member, idx) => (
                      <div key={member.id || idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-100">{member.name}</span>
                          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">{member.year}</span>
                        </div>
                        <p className="text-xs font-mono text-cyan-300">{member.rollNumber}</p>
                        <p className="text-[11px] text-slate-400 truncate">{member.department}</p>
                        {member.email && <p className="text-[11px] text-slate-500 font-mono truncate">{member.email}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* EDITING MODE VIEW */
                <div className="space-y-6 animate-in fade-in">
                  {/* Team Size Chooser Bar */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      Select Team Size (2 to 4 Members Total)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {([2, 3, 4] as TeamSize[]).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleTeamSizeChange(sz)}
                          className={`py-2.5 px-3 rounded-xl font-display font-bold text-xs flex flex-col items-center justify-center transition-all ${
                            editTeamSize === sz
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple border border-purple-400'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-sm font-black">{sz} Members</span>
                          <span className="text-[10px] font-mono opacity-80">
                            1 Leader + {sz - 1} Member{sz > 2 ? 's' : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editable Members List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        Team Members Details ({editMembers.length} configured)
                      </span>
                      {editTeamSize < 4 && (
                        <button
                          type="button"
                          onClick={handleAddMember}
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-display"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Member ({editTeamSize + 1} total)</span>
                        </button>
                      )}
                    </div>

                    {editMembers.map((member, idx) => (
                      <div
                        key={member.id || idx}
                        className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 relative group space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span>Member #{idx + 1}</span>
                          </span>

                          {/* Remove Member Button */}
                          <button
                            type="button"
                            disabled={editTeamSize <= 2}
                            onClick={() => handleRemoveMember(idx)}
                            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors ${
                              editTeamSize > 2
                                ? 'bg-rose-950/70 border-rose-800 text-rose-300 hover:bg-rose-900 hover:text-white cursor-pointer'
                                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                            }`}
                            title={editTeamSize <= 2 ? 'Minimum 2 team members required' : 'Remove this member'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                              placeholder="e.g. Ananya Rao"
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                              Roll Number *
                            </label>
                            <input
                              type="text"
                              value={member.rollNumber}
                              onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value.toUpperCase())}
                              placeholder="e.g. 23881A0512"
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                              Department *
                            </label>
                            <select
                              value={member.department}
                              onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none"
                            >
                              {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                                  {dept}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                              Year of Study *
                            </label>
                            <select
                              value={member.year}
                              onChange={(e) => handleMemberChange(idx, 'year', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none font-mono"
                            >
                              {YEARS.map((yr) => (
                                <option key={yr} value={yr} className="bg-slate-900 text-slate-200">
                                  {yr}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons in Edit Mode */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleCancelTeamEdits}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={isSavingTeam}
                      onClick={handleSaveTeamEdits}
                      className="px-6 py-2 rounded-xl cyber-gradient-btn text-white text-xs font-bold flex items-center gap-2 shadow-glow-purple"
                    >
                      {isSavingTeam ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving Changes to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes to Cloud</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin / Organizer Review Notes */}
            {loggedInTeam.adminNotes && (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-700/50 text-xs text-purple-200">
                <span className="font-bold block text-[10px] uppercase font-mono text-purple-300 mb-1">
                  Organizer Review Note
                </span>
                {loggedInTeam.adminNotes}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold font-display flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Another Team</span>
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        ) : (
          /* NOT LOGGED IN: TAB 1 (TEAM LEADER LOGIN) OR TAB 2 (ORGANIZER) */
          <div>
            {/* TAB 1: TEAM LEADER LOGIN */}
            {activeTab === 'leader' && (
              <div className="max-w-md mx-auto animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-800/60 mb-6 text-xs text-purple-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Team Leader Credentials:</span>
                    Login with the <strong className="text-cyan-300">Team Leader's Email</strong> and use the <strong className="text-cyan-300">Team Leader's Name</strong> as the password.
                  </div>
                </div>

                <form onSubmit={handleLeaderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Team Leader Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        placeholder="e.g. leader@vardhaman.org"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Password (Team Leader Name)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={leaderNamePassword}
                        onChange={(e) => setLeaderNamePassword(e.target.value)}
                        placeholder="Enter Team Leader Full Name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl cyber-gradient-btn text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple transition-all mt-6"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Team Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In as Team Leader</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    Haven't registered your hackathon team yet?{' '}
                    <button
                      type="button"
                      onClick={onNavigateToRegister}
                      className="text-cyan-300 font-bold hover:underline"
                    >
                      Register Your Team Now &rarr;
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ORGANIZER ACCESS */}
            {activeTab === 'admin' && (
              <div className="max-w-md mx-auto space-y-6 animate-in fade-in">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-600/50 flex items-center justify-center mx-auto mb-3 text-purple-300 shadow-glow-purple">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-1">
                    Organizer Portal Access
                  </h3>
                  <p className="text-xs text-slate-400">
                    Authorized access for Vardhaman College & Algorand Club admins.
                  </p>
                </div>

                {isAdminAuthenticated ? (
                  <div className="space-y-4 text-center">
                    <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs">
                      Organizer session is active.
                    </div>
                    <button
                      type="button"
                      onClick={onNavigateToAdmin}
                      className="w-full py-3 px-4 rounded-xl cyber-gradient-btn text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Go to Admin Dashboard</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Organizer Email
                      </label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Organizer Passcode
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter passcode..."
                        className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono"
                      />
                    </div>

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
                      <span>Authenticate to Admin Dashboard</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
