import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Building, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  X, 
  FileSpreadsheet, 
  Printer, 
  Layers, 
  Sparkles,
  Award,
  Unlock,
  Lock,
  Settings,
  Plus,
  Minus,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  UserX,
  RefreshCw,
  Terminal,
  Zap
} from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { RegistrationData, ProblemStatement } from '../../types';
import { RegistrationDetailModal } from './RegistrationDetailModal';
import { CATEGORIES } from '../../data/problemStatements';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const { 
    registrations, 
    updateRegistrationStatus, 
    deleteRegistration, 
    logoutAdmin,
    adminUser,
    problemStatements,
    isPSReleased,
    setMasterPSReleased,
    updateProblemStatementLimit,
    toggleProblemStatementRelease,
    getPSSelectionStats,
    selectTeamProblemStatement,
    unassignTeamProblemStatement
  } = useRegistration();

  const [activeTab, setActiveTab] = useState<'registrations' | 'problem-statements'>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [psFilter, setPsFilter] = useState<string>('all');
  const [selectedReg, setSelectedReg] = useState<RegistrationData | null>(null);

  // PS Tab Filters & UI States
  const [psCategoryFilter, setPsCategoryFilter] = useState<string>('All');
  const [expandedPSId, setExpandedPSId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute Metrics
  const totalRegistrations = registrations.length;
  const totalParticipants = registrations.reduce((acc, curr) => acc + curr.teamSize, 0);
  const uniqueColleges = Array.from(new Set(registrations.map(r => r.collegeName))).filter(Boolean);
  const avgTeamSize = totalRegistrations > 0 ? (totalParticipants / totalRegistrations).toFixed(1) : '0';

  // Overall track capacity stats
  const totalSlotsCapacity = problemStatements.reduce((acc, ps) => acc + (ps.maxTeams || 5), 0);
  const totalSlotsOccupied = registrations.filter(r => r.problemStatementId).length;
  const totalSlotsRemaining = Math.max(0, totalSlotsCapacity - totalSlotsOccupied);

  // Filtered registrations
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.registrationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.teamLeader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.teamLeader.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.collegeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCollege = collegeFilter === 'all' || r.collegeName === collegeFilter;
    const matchesPs = psFilter === 'all' || r.problemStatementId === psFilter;

    return matchesSearch && matchesCollege && matchesPs;
  });

  // Filtered Problem Statements in PS tab
  const filteredProblemStatements = problemStatements.filter(ps => {
    if (psCategoryFilter === 'All') return true;
    return ps.category === psCategoryFilter;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Team Name',
      'Team Size',
      'College Name',
      'College City',
      'Problem Statement ID',
      'Problem Statement Title',
      'Leader Name',
      'Leader Year',
      'Leader Roll Number',
      'Leader Department',
      'Leader Email',
      'Leader Phone',
      'Member 1 Name',
      'Member 1 Roll',
      'Member 2 Name',
      'Member 2 Roll',
      'Member 3 Name',
      'Member 3 Roll',
      'Created At'
    ];

    const rows = filteredRegistrations.map(r => {
      const m1 = r.members[0] || {};
      const m2 = r.members[1] || {};
      const m3 = r.members[2] || {};
      const psMatch = problemStatements.find(p => p.psId === r.problemStatementId);

      return [
        `"${r.registrationId}"`,
        `"${r.teamName.replace(/"/g, '""')}"`,
        r.teamSize,
        `"${r.collegeName.replace(/"/g, '""')}"`,
        `"${r.collegeCity || ''}"`,
        `"${r.problemStatementId || 'Unassigned'}"`,
        `"${psMatch ? psMatch.title.replace(/"/g, '""') : 'Open Track'}"`,
        `"${r.teamLeader.name.replace(/"/g, '""')}"`,
        `"${r.teamLeader.year}"`,
        `"${r.teamLeader.rollNumber}"`,
        `"${r.teamLeader.department || ''}"`,
        `"${r.teamLeader.email}"`,
        `"${r.teamLeader.phone}"`,
        `"${m1.name || ''}"`,
        `"${m1.rollNumber || ''}"`,
        `"${m2.name || ''}"`,
        `"${m2.rollNumber || ''}"`,
        `"${m3.name || ''}"`,
        `"${m3.rollNumber || ''}"`,
        `"${new Date(r.createdAt).toLocaleString('en-IN')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `blocknova_2026_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdjustLimit = (psId: string, currentLimit: number, delta: number) => {
    const newLimit = Math.max(1, currentLimit + delta);
    updateProblemStatementLimit(psId, newLimit);
    showToast(`Updated team limit for ${psId} to ${newLimit} teams.`);
  };

  const handleUnassignTeam = async (reg: RegistrationData) => {
    const ok = window.confirm(`Unassign problem statement track from "${reg.teamName}"?`);
    if (!ok) return;
    const res = await unassignTeamProblemStatement(reg.registrationId);
    if (res.success) {
      showToast(`Unassigned track from team ${reg.teamName}.`);
    } else {
      showToast(res.error || `Failed to unassign track.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-cyan-950 border border-cyan-500 text-cyan-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950/80 border border-purple-800 text-purple-300">
              ⚡ LIVE ORGANIZER PORTAL
            </span>
            <span className="text-xs font-mono text-slate-400">
              BlockNova 2026 • Vardhaman College of Engineering
            </span>
          </div>
          <h1 className="font-display font-black text-3xl text-white tracking-tight">
            Hackathon Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-200">{adminUser?.email || 'admin@vardhaman.org'}</div>
            <div className="text-[11px] font-mono text-cyan-400">Super Administrator</div>
          </div>

          <button
            onClick={logoutAdmin}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 transition-colors"
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToHome}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-purple-300">Total Teams</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-white">
            {totalRegistrations}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {totalParticipants} total hackers
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-300">Total Participants</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-emerald-400">
            {totalParticipants}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Registered members & leaders
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-cyan-300">Track Allocation</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-cyan-300">
            {totalSlotsOccupied} <span className="text-sm font-normal text-slate-400">/ {totalSlotsCapacity}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {totalSlotsRemaining} open track slots
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-amber-300">PS Release State</span>
            {isPSReleased ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
          </div>
          <div className={`font-display font-black text-xl sm:text-2xl ${isPSReleased ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isPSReleased ? 'UNLOCKED' : 'LOCKED'}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {isPSReleased ? 'Open for team selection' : 'Phase 2 Pending'}
          </span>
        </div>

      </div>

      {/* Navigation Tabs (Registrations vs Problem Statements) */}
      <div className="flex items-center justify-between border-b border-slate-800 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`pb-3 font-display font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'registrations'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Registrations ({filteredRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('problem-statements')}
            className={`pb-3 font-display font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'problem-statements'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Problem Statements & Quota Control</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 border border-purple-800 text-purple-300">
              {problemStatements.length} Challenges
            </span>
          </button>
        </div>

        {activeTab === 'registrations' && (
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <Printer className="w-3.5 h-3.5 text-purple-400" />
              <span>Print Report</span>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'registrations' ? (
        <div className="space-y-6">
          
          {/* Filter & Search Toolbar */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search team, ID, roll no, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            {/* College Filter */}
            <div>
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer truncate"
              >
                <option value="all">All Colleges ({uniqueColleges.length})</option>
                {uniqueColleges.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Problem Statement Filter */}
            <div>
              <select
                value={psFilter}
                onChange={(e) => setPsFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Problem Statements</option>
                {problemStatements.map((ps) => {
                  const stats = getPSSelectionStats(ps.psId);
                  return (
                    <option key={ps.psId} value={ps.psId}>
                      {ps.psId}: {ps.title} ({stats.count}/{stats.maxTeams} teams)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Registrations Data Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Reg ID</th>
                    <th className="py-3.5 px-4 font-semibold">Team & College</th>
                    <th className="py-3.5 px-4 font-semibold">Team Leader</th>
                    <th className="py-3.5 px-4 font-semibold">Size</th>
                    <th className="py-3.5 px-4 font-semibold">Selected PS / Track</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                        No registrations match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => {
                      const psMatch = problemStatements.find(p => p.psId === reg.problemStatementId);
                      return (
                        <tr 
                          key={reg.registrationId}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedReg(reg)}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                            {reg.registrationId}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-display font-bold text-white text-sm">{reg.teamName}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                              {reg.collegeName}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="text-slate-200 font-medium">{reg.teamLeader.name}</div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {reg.teamLeader.rollNumber} • {reg.teamLeader.phone}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                            {reg.teamSize} Hackers
                          </td>

                          <td className="py-3.5 px-4">
                            {reg.problemStatementId ? (
                              <div className="flex flex-col">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/60 text-purple-300 font-mono text-[11px] font-bold w-fit">
                                  <span>{reg.problemStatementId}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                                  {psMatch?.title || reg.problemStatementId}
                                </span>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                                Open Track
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedReg(reg)}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                                title="View Full Dossier"
                              >
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                <span>View Dossier</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* PROBLEM STATEMENTS & QUOTA CONTROL TAB                                    */
        /* ========================================================================= */
        <div className="space-y-8 animate-in fade-in">
          
          {/* Master Release Control Center Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/40 relative overflow-hidden bg-gradient-to-br from-[#0e0f24] via-[#0c0d1c] to-[#070814] shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                    isPSReleased 
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-glow-emerald'
                      : 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-glow-amber'
                  }`}>
                    {isPSReleased ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isPSReleased ? 'STATUS: PROBLEM STATEMENTS RELEASED' : 'STATUS: PROBLEM STATEMENTS LOCKED'}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">Master Switch</span>
                </div>

                <h2 className="font-display font-black text-2xl text-white">
                  Problem Statement Release & Quota Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {isPSReleased ? (
                    <span>All problem statement tracks are currently <strong>released and visible</strong> to all participants on the home page, navbar, registration wizard, and team dashboard.</span>
                  ) : (
                    <span>Problem statements are currently <strong>locked and hidden</strong> from all public pages, the navbar, registration forms, and team leader dashboards until you release them.</span>
                  )}
                </p>
              </div>

              {/* Master Toggle Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isPSReleased;
                    setMasterPSReleased(nextState);
                    showToast(nextState ? 'Problem Statements RELEASED to all teams!' : 'Problem Statements LOCKED.');
                  }}
                  className={`px-6 py-3.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                    isPSReleased
                      ? 'bg-rose-950/90 hover:bg-rose-900 border border-rose-600 text-rose-200'
                      : 'cyber-gradient-btn text-white shadow-glow-purple'
                  }`}
                >
                  {isPSReleased ? (
                    <>
                      <Lock className="w-4 h-4 text-rose-300" />
                      <span>Lock Problem Statements</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-cyan-300" />
                      <span>Release to All Teams Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter & Global Summary Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 w-fit">
              {CATEGORIES.map((cat) => {
                const isSelected = psCategoryFilter === cat;
                const count = cat === 'All' 
                  ? problemStatements.length 
                  : problemStatements.filter(p => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setPsCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] font-mono opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Showing {filteredProblemStatements.length} Problem Statements • Live Slots: {totalSlotsOccupied} / {totalSlotsCapacity}</span>
            </div>
          </div>

          {/* Problem Statement Cards Grid with Limit Controls & Enrolled Teams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProblemStatements.map((ps) => {
              const stats = getPSSelectionStats(ps.psId);
              const isExpanded = expandedPSId === ps.psId;

              return (
                <div 
                  key={ps.psId} 
                  className={`glass-card rounded-3xl p-6 border transition-all space-y-5 ${
                    stats.isFull 
                      ? 'border-rose-500/40 bg-gradient-to-b from-rose-950/10 to-slate-950/80' 
                      : 'border-slate-800 hover:border-purple-500/40 bg-slate-900/60'
                  }`}
                >
                  {/* Card Top: PS ID, Category, Difficulty & Release Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-1 rounded-lg">
                        {ps.psId}
                      </span>
                      <span className="text-[11px] font-bold text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded-lg border border-purple-800/40">
                        {ps.category}
                      </span>
                      {ps.difficulty && (
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                          {ps.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          toggleProblemStatementRelease(ps.psId);
                          showToast(`Toggled release state for ${ps.psId}`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 border transition-colors ${
                          ps.isReleased !== false
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                        title="Toggle individual track selection state"
                      >
                        {ps.isReleased !== false ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                        <span>{ps.isReleased !== false ? 'Active' : 'Disabled'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-display font-black text-xl text-white mb-2">
                      {ps.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-light">
                      {ps.fullDescription}
                    </p>
                  </div>

                  {/* TEAM LIMIT / CAPACITY CONTROLLER */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Team Limit & Capacity</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          stats.isFull 
                            ? 'bg-rose-950 border border-rose-800 text-rose-300' 
                            : 'bg-slate-900 text-cyan-300 border border-slate-800'
                        }`}>
                          {stats.count} / {stats.maxTeams} Teams ({stats.percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          stats.isFull 
                            ? 'bg-gradient-to-r from-rose-500 to-red-600' 
                            : stats.percentage >= 70 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                            : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                        }`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>

                    {/* Limit Stepper & Quick Presets */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-400">Adjust Limit:</span>
                        <button
                          type="button"
                          onClick={() => handleAdjustLimit(ps.psId, stats.maxTeams, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                          title="Decrease team quota"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-xs text-white">
                          {stats.maxTeams}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdjustLimit(ps.psId, stats.maxTeams, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                          title="Increase team quota"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Quick presets */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-slate-500 mr-1">Presets:</span>
                        {[3, 5, 8, 10].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              updateProblemStatementLimit(ps.psId, num);
                              showToast(`Set limit for ${ps.psId} to ${num} teams.`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              stats.maxTeams === num
                                ? 'bg-purple-600 text-white font-bold'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Suggested Tech Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {ps.suggestedTech?.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* ENROLLED TEAMS ACCORDION */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setExpandedPSId(isExpanded ? null : ps.psId)}
                      className="w-full flex items-center justify-between text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Enrolled Teams ({stats.teams.length} of {stats.maxTeams})</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2 animate-in fade-in">
                        {stats.teams.length === 0 ? (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500 font-mono">
                            No teams have enrolled in this problem statement yet.
                          </div>
                        ) : (
                          stats.teams.map((team) => (
                            <div 
                              key={team.registrationId}
                              className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                            >
                              <div>
                                <div className="font-display font-bold text-slate-100 flex items-center gap-2">
                                  <span>{team.teamName}</span>
                                  <span className="font-mono text-[10px] text-cyan-400">({team.registrationId})</span>
                                </div>
                                <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                  {team.teamLeader.name} • {team.collegeName}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedReg(team)}
                                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-mono flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3 text-cyan-400" />
                                  <span>Dossier</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUnassignTeam(team)}
                                  className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
                                  title="Unassign track from this team"
                                >
                                  <UserX className="w-3 h-3" />
                                  <span>Unassign</span>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Dossier Detail Modal */}
      {selectedReg && (
        <RegistrationDetailModal
          registration={selectedReg}
          onClose={() => setSelectedReg(null)}
          onUpdateStatus={updateRegistrationStatus}
          onDelete={deleteRegistration}
        />
      )}

    </div>
  );
};
