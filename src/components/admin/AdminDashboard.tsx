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
  Award
} from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { RegistrationData } from '../../types';
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
    problemStatements 
  } = useRegistration();

  const [activeTab, setActiveTab] = useState<'registrations' | 'problem-statements'>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [psFilter, setPsFilter] = useState<string>('all');
  const [selectedReg, setSelectedReg] = useState<RegistrationData | null>(null);

  // Compute Metrics
  const totalRegistrations = registrations.length;
  const totalParticipants = registrations.reduce((acc, curr) => acc + curr.teamSize, 0);
  const uniqueColleges = Array.from(new Set(registrations.map(r => r.collegeName))).filter(Boolean);
  const avgTeamSize = totalRegistrations > 0 ? (totalParticipants / totalRegistrations).toFixed(1) : '0';

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

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Team Name',
      'Team Size',
      'College Name',
      'College City',
      'Problem Statement',
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

      return [
        `"${r.registrationId}"`,
        `"${r.teamName.replace(/"/g, '""')}"`,
        r.teamSize,
        `"${r.collegeName.replace(/"/g, '""')}"`,
        `"${r.collegeCity || ''}"`,
        `"${r.problemStatementId || 'Open'}"`,
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950/80 border border-purple-800 text-purple-300">
              ⚡ LIVE ORGANIZER PORTAL
            </span>
            <span className="text-xs font-mono text-slate-400">
              BlockNova 2026 • Vardhaman College
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
            <span className="text-xs font-mono text-cyan-300">Institutions</span>
            <Building className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-cyan-300">
            {uniqueColleges.length}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Unique colleges
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-amber-300">Avg Team Size</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-amber-400">
            {avgTeamSize}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Members per team</span>
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
            className={`pb-3 font-display font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'problem-statements'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Problem Statements Catalog ({problemStatements.length})
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
                placeholder="Search team, ID, roll no..."
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
                {problemStatements.map((ps) => (
                  <option key={ps.psId} value={ps.psId}>{ps.psId} ({ps.category})</option>
                ))}
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
                    <th className="py-3.5 px-4 font-semibold">Track / PS</th>
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
                    filteredRegistrations.map((reg) => (
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
                          {reg.teamSize}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-mono text-[11px]">
                            {reg.problemStatementId || 'Open Track'}
                          </span>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* Problem Statements Management Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problemStatements.map((ps) => (
            <div key={ps.psId} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  {ps.psId}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {ps.category}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-white">{ps.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{ps.shortDescription}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Evaluation: {ps.evaluationCriteria || 'Standard Rubric'}
              </div>
            </div>
          ))}
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
