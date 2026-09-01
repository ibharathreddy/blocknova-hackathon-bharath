import React, { createContext, useContext, useState, useEffect } from 'react';
import { RegistrationData, RegistrationStatus, ProblemStatement, TeamSize, UserAuthProfile } from '../types';
import { INITIAL_REGISTRATIONS } from '../data/mockRegistrations';
import { PROBLEM_STATEMENTS } from '../data/problemStatements';
import { generateRegistrationId, isTeamNameTaken } from '../utils/validation';
import {
  saveRegistrationToFirestore,
  subscribeToRegistrationsFirestore,
  updateRegistrationStatusInFirestore,
  deleteRegistrationFromFirestore,
  savePSConfigToFirestore,
  subscribeToPSConfigFirestore,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  subscribeToAuth
} from '../services/firebase';

interface SubmitRegistrationPayload {
  collegeName: string;
  collegeCity?: string;
  collegeState?: string;
  teamName: string;
  teamSize: TeamSize;
  teamLeader: RegistrationData['teamLeader'];
  members: RegistrationData['members'];
  problemStatementId?: string;
  projectIdea?: string;
}

export interface PSSelectionStats {
  psId: string;
  title: string;
  category: string;
  count: number;
  maxTeams: number;
  isFull: boolean;
  remaining: number;
  percentage: number;
  teams: RegistrationData[];
}

interface RegistrationContextType {
  registrations: RegistrationData[];
  problemStatements: ProblemStatement[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  selectedProblemStatement: ProblemStatement | null;
  setSelectedProblemStatement: (ps: ProblemStatement | null) => void;
  currentRegistrationId: string | null;
  setCurrentRegistrationId: (id: string | null) => void;
  submitRegistration: (payload: SubmitRegistrationPayload) => Promise<{ success: boolean; registrationId?: string; error?: string }>;
  updateRegistrationStatus: (id: string, status: RegistrationStatus, notes?: string, reviewer?: string) => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
  getRegistrationById: (id: string) => RegistrationData | undefined;
  checkTeamNameAvailable: (name: string, excludeId?: string) => boolean;
  isAdminAuthenticated: boolean;
  adminUser: { email: string; role: 'superadmin' | 'reviewer' } | null;
  loginAdmin: (password: string, email?: string) => boolean;
  logoutAdmin: () => void;
  selectedPSForRegistration: string | null;
  setSelectedPSForRegistration: (psId: string | null) => void;
  
  // Problem Statement Release & Limit Management
  isPSReleased: boolean;
  setMasterPSReleased: (released: boolean) => void;
  updateProblemStatementLimit: (psId: string, maxTeams: number) => void;
  toggleProblemStatementRelease: (psId: string, isReleased?: boolean) => void;
  selectTeamProblemStatement: (registrationId: string, psId: string) => Promise<{ success: boolean; error?: string }>;
  unassignTeamProblemStatement: (registrationId: string) => Promise<{ success: boolean; error?: string }>;
  getPSSelectionStats: (psId: string) => PSSelectionStats;
  getAllPSSelectionStats: () => PSSelectionStats[];

  // Team Leader & Firebase Auth States
  loggedInTeam: RegistrationData | null;
  currentUser: UserAuthProfile | null;
  authLoading: boolean;
  isFirebaseSyncing: boolean;
  loginTeamLeader: (email: string, leaderNamePassword: string) => { success: boolean; team?: RegistrationData; error?: string };
  logoutTeamLeader: () => void;
  updateTeamRegistration: (updatedReg: RegistrationData) => Promise<{ success: boolean; error?: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupUser: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const STORAGE_KEY = 'blocknova_2026_registrations';
const ADMIN_AUTH_KEY = 'blocknova_2026_admin_auth';
const TEAM_AUTH_KEY = 'blocknova_2026_team_auth';
const PS_RELEASED_KEY = 'blocknova_2026_ps_released';
const PS_STORAGE_KEY = 'blocknova_2026_problem_statements';

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load registrations from storage', e);
    }
    return INITIAL_REGISTRATIONS;
  });

  // Problem Statements List with persistent overrides (limits / release flags)
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>(() => {
    try {
      const saved = localStorage.getItem(PS_STORAGE_KEY);
      if (saved) {
        const parsed: ProblemStatement[] = JSON.parse(saved);
        // Merge with current default PROBLEM_STATEMENTS in case schema updated
        return PROBLEM_STATEMENTS.map(defaultPS => {
          const match = parsed.find(p => p.psId === defaultPS.psId);
          if (match) {
            return {
              ...defaultPS,
              maxTeams: match.maxTeams !== undefined ? match.maxTeams : defaultPS.maxTeams,
              isReleased: match.isReleased !== undefined ? match.isReleased : defaultPS.isReleased,
              isActive: match.isActive !== undefined ? match.isActive : defaultPS.isActive
            };
          }
          return defaultPS;
        });
      }
    } catch (e) {
      console.error('Failed to load problem statements from storage', e);
    }
    return PROBLEM_STATEMENTS;
  });

  // Master Problem Statement Release Switch (default: false / locked until Admin unlocks/releases it)
  const [isPSReleased, setIsPSReleased] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(PS_RELEASED_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      return false;
    }
    return false;
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProblemStatement, setSelectedProblemStatement] = useState<ProblemStatement | null>(null);
  const [selectedPSForRegistration, setSelectedPSForRegistration] = useState<string | null>(null);
  const [currentRegistrationId, setCurrentRegistrationId] = useState<string | null>(null);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState<boolean>(false);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserAuthProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Team Leader Logged In State
  const [loggedInTeam, setLoggedInTeam] = useState<RegistrationData | null>(() => {
    try {
      const savedTeamId = localStorage.getItem(TEAM_AUTH_KEY);
      if (savedTeamId) {
        const savedRegistrations = localStorage.getItem(STORAGE_KEY);
        const list: RegistrationData[] = savedRegistrations ? JSON.parse(savedRegistrations) : INITIAL_REGISTRATIONS;
        return list.find(r => r.registrationId === savedTeamId) || null;
      }
    } catch {
      return null;
    }
    return null;
  });

  // Admin Auth State (uses sessionStorage so auth does not persist across new browser sessions or pulls)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      // Clean up legacy persistent localStorage key if present
      localStorage.removeItem(ADMIN_AUTH_KEY);
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<{ email: string; role: 'superadmin' | 'reviewer' } | null>(() => {
    try {
      if (sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true') {
        return { email: 'admin@vardhaman.org', role: 'superadmin' };
      }
    } catch {}
    return null;
  });

  // 1. Subscribe to Firebase Auth changes
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth((user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Participant',
          isAnonymous: user.isAnonymous
        });
      } else {
        if (!loggedInTeam) {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, [loggedInTeam]);

  // 2. Subscribe to Firebase Firestore Real-time updates for registrations
  useEffect(() => {
    setIsFirebaseSyncing(true);
    const unsubscribeFirestore = subscribeToRegistrationsFirestore(
      (firestoreRegistrations) => {
        setIsFirebaseSyncing(false);
        if (firestoreRegistrations && firestoreRegistrations.length > 0) {
          setRegistrations((prevLocal) => {
            const combinedMap = new Map<string, RegistrationData>();
            prevLocal.forEach((r) => combinedMap.set(r.registrationId, r));
            firestoreRegistrations.forEach((r) => combinedMap.set(r.registrationId, r));
            const merged = Array.from(combinedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            return merged;
          });

          setLoggedInTeam((current) => {
            if (!current) return null;
            const updated = firestoreRegistrations.find(r => r.registrationId === current.registrationId);
            return updated || current;
          });
        }
      },
      (error) => {
        setIsFirebaseSyncing(false);
        console.warn('Firestore subscription fallback to local cache:', error);
      }
    );

    return () => unsubscribeFirestore();
  }, []);

  // 3. Save registrations to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    } catch (e) {
      console.error('Failed to save registrations to storage', e);
    }
  }, [registrations]);

  // 4. Save problem statements overrides
  useEffect(() => {
    try {
      localStorage.setItem(PS_STORAGE_KEY, JSON.stringify(problemStatements));
    } catch (e) {
      console.error('Failed to save problem statements to storage', e);
    }
  }, [problemStatements]);

  // 5. Save PS release status
  useEffect(() => {
    try {
      localStorage.setItem(PS_RELEASED_KEY, String(isPSReleased));
    } catch (e) {
      console.error('Failed to save ps released state to storage', e);
    }
  }, [isPSReleased]);

  // 6. Cross-tab & Firestore real-time sync for PS release status & limits
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PS_RELEASED_KEY && e.newValue !== null) {
        setIsPSReleased(e.newValue === 'true');
      }
      if (e.key === PS_STORAGE_KEY && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProblemStatements(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const unsubscribePSConfig = subscribeToPSConfigFirestore((config) => {
      if (config) {
        if (config.isPSReleased !== undefined) {
          setIsPSReleased(Boolean(config.isPSReleased));
          try {
            localStorage.setItem(PS_RELEASED_KEY, String(config.isPSReleased));
          } catch {}
        }
        if (config.problemStatements && Array.isArray(config.problemStatements)) {
          setProblemStatements(config.problemStatements);
          try {
            localStorage.setItem(PS_STORAGE_KEY, JSON.stringify(config.problemStatements));
          } catch {}
        }
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubscribePSConfig();
    };
  }, []);

  const checkTeamNameAvailable = (name: string, excludeId?: string): boolean => {
    return !isTeamNameTaken(name, registrations, excludeId);
  };

  // Problem Statement Helper Functions
  const setMasterPSReleased = (released: boolean) => {
    setIsPSReleased(released);
    try {
      localStorage.setItem(PS_RELEASED_KEY, String(released));
    } catch (e) {
      console.error('Failed to save ps released state to storage', e);
    }
    savePSConfigToFirestore({ isPSReleased: released });
  };

  const updateProblemStatementLimit = (psId: string, maxTeams: number) => {
    const validLimit = Math.max(1, Math.min(100, Math.floor(maxTeams) || 1));
    setProblemStatements(prev => {
      const updated = prev.map(ps => (ps.psId === psId ? { ...ps, maxTeams: validLimit } : ps));
      savePSConfigToFirestore({ problemStatements: updated });
      return updated;
    });
  };

  const toggleProblemStatementRelease = (psId: string, isReleased?: boolean) => {
    setProblemStatements(prev =>
      prev.map(ps => {
        if (ps.psId === psId) {
          const nextVal = isReleased !== undefined ? isReleased : !ps.isReleased;
          return { ...ps, isReleased: nextVal, isActive: nextVal };
        }
        return ps;
      })
    );
  };

  const getPSSelectionStats = (psId: string): PSSelectionStats => {
    const ps = problemStatements.find(p => p.psId === psId);
    const maxTeams = ps?.maxTeams ?? 5;
    const teams = registrations.filter(r => r.problemStatementId === psId);
    const count = teams.length;
    const isFull = count >= maxTeams;
    const remaining = Math.max(0, maxTeams - count);
    const percentage = Math.min(100, Math.round((count / maxTeams) * 100));

    return {
      psId,
      title: ps?.title || psId,
      category: ps?.category || 'Standard Entry Projects',
      count,
      maxTeams,
      isFull,
      remaining,
      percentage,
      teams
    };
  };

  const getAllPSSelectionStats = (): PSSelectionStats[] => {
    return problemStatements.map(ps => getPSSelectionStats(ps.psId));
  };

  const selectTeamProblemStatement = async (
    registrationId: string,
    psId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isPSReleased) {
      return {
        success: false,
        error: 'Problem statements have not been released by organizers yet.'
      };
    }

    const ps = problemStatements.find(p => p.psId === psId);
    if (!ps) {
      return { success: false, error: `Problem Statement ${psId} not found.` };
    }

    if (ps.isReleased === false || ps.isActive === false) {
      return {
        success: false,
        error: `Problem Statement ${psId} is currently not open for selection.`
      };
    }

    const currentReg = registrations.find(r => r.registrationId === registrationId);
    if (!currentReg) {
      return { success: false, error: 'Team registration record not found.' };
    }

    // If team already has this PS selected, it is fine
    if (currentReg.problemStatementId === psId) {
      return { success: true };
    }

    // Check slot limit
    const stats = getPSSelectionStats(psId);
    if (stats.count >= stats.maxTeams) {
      return {
        success: false,
        error: `Slot full for ${ps.title} (${stats.count}/${stats.maxTeams} teams registered). Please select another problem statement.`
      };
    }

    const now = new Date().toISOString();
    const updatedReg: RegistrationData = {
      ...currentReg,
      problemStatementId: psId,
      updatedAt: now
    };

    // Update local state
    setRegistrations(prev =>
      prev.map(r => (r.registrationId === registrationId ? updatedReg : r))
    );

    if (loggedInTeam?.registrationId === registrationId) {
      setLoggedInTeam(updatedReg);
    }

    // Save to Firestore
    try {
      setIsFirebaseSyncing(true);
      await saveRegistrationToFirestore(updatedReg);
    } catch (err) {
      console.warn('Firestore update failed, updated locally:', err);
    } finally {
      setIsFirebaseSyncing(false);
    }

    return { success: true };
  };

  const unassignTeamProblemStatement = async (
    registrationId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const currentReg = registrations.find(r => r.registrationId === registrationId);
    if (!currentReg) {
      return { success: false, error: 'Registration record not found.' };
    }

    const now = new Date().toISOString();
    const updatedReg: RegistrationData = {
      ...currentReg,
      problemStatementId: undefined,
      updatedAt: now
    };

    setRegistrations(prev =>
      prev.map(r => (r.registrationId === registrationId ? updatedReg : r))
    );

    if (loggedInTeam?.registrationId === registrationId) {
      setLoggedInTeam(updatedReg);
    }

    try {
      setIsFirebaseSyncing(true);
      await saveRegistrationToFirestore(updatedReg);
    } catch (err) {
      console.warn('Firestore unassign failed, updated locally:', err);
    } finally {
      setIsFirebaseSyncing(false);
    }

    return { success: true };
  };

  // Team Leader Login: Email = Team Leader Email, Password = Team Leader Name
  const loginTeamLeader = (email: string, leaderNamePassword: string): { success: boolean; team?: RegistrationData; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = leaderNamePassword.trim().toLowerCase();

    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        error: 'Please enter both Team Leader Email and Team Leader Name (as password).'
      };
    }

    const matchedTeam = registrations.find((r) => {
      const leaderEmail = r.teamLeader.email?.trim().toLowerCase();
      const leaderName = r.teamLeader.name?.trim().toLowerCase();
      return leaderEmail === cleanEmail && leaderName === cleanPassword;
    });

    if (matchedTeam) {
      setLoggedInTeam(matchedTeam);
      setCurrentUser({
        uid: matchedTeam.registrationId,
        email: matchedTeam.teamLeader.email,
        displayName: matchedTeam.teamLeader.name
      });
      localStorage.setItem(TEAM_AUTH_KEY, matchedTeam.registrationId);
      return {
        success: true,
        team: matchedTeam
      };
    }

    return {
      success: false,
      error: 'Invalid login details. Please enter your registered Team Leader Email and Team Leader Name (as password).'
    };
  };

  const logoutTeamLeader = () => {
    setLoggedInTeam(null);
    setCurrentUser(null);
    localStorage.removeItem(TEAM_AUTH_KEY);
  };

  const submitRegistration = async (payload: SubmitRegistrationPayload): Promise<{ success: boolean; registrationId?: string; error?: string }> => {
    // 1. Uniqueness check
    if (!checkTeamNameAvailable(payload.teamName)) {
      return {
        success: false,
        error: `The team name "${payload.teamName}" is already registered. Please choose another name.`
      };
    }

    // 2. Validate team size & members array length
    if (payload.members.length !== payload.teamSize - 1) {
      return {
        success: false,
        error: `Expected ${payload.teamSize - 1} team members for a team of ${payload.teamSize}, but received ${payload.members.length}.`
      };
    }

    // 3. If a problem statement is selected, check capacity
    const targetPsId = payload.problemStatementId || selectedPSForRegistration || undefined;
    if (targetPsId) {
      const stats = getPSSelectionStats(targetPsId);
      if (stats.count >= stats.maxTeams) {
        return {
          success: false,
          error: `Selected Problem Statement ${targetPsId} has reached its maximum quota of ${stats.maxTeams} teams. Please pick another track or leave open.`
        };
      }
    }

    // 4. Generate sequential ID safely avoiding collisions
    const newId = generateRegistrationId(registrations);
    const now = new Date().toISOString();

    const newRegistration: RegistrationData = {
      registrationId: newId,
      status: 'pending',
      collegeName: payload.collegeName.trim(),
      collegeCity: payload.collegeCity?.trim() || 'Hyderabad',
      collegeState: payload.collegeState?.trim() || 'Telangana',
      teamName: payload.teamName.trim(),
      teamNameLower: payload.teamName.trim().toLowerCase(),
      teamSize: payload.teamSize,
      teamLeader: {
        ...payload.teamLeader,
        name: payload.teamLeader.name.trim(),
        rollNumber: payload.teamLeader.rollNumber.trim().toUpperCase(),
        email: payload.teamLeader.email.trim().toLowerCase(),
        phone: payload.teamLeader.phone.trim()
      },
      members: payload.members.map((m, idx) => ({
        ...m,
        id: m.id || `m_${idx + 1}_${Date.now()}`,
        name: m.name.trim(),
        rollNumber: m.rollNumber.trim().toUpperCase(),
        department: m.department.trim(),
        email: m.email?.trim().toLowerCase()
      })),
      problemStatementId: targetPsId,
      projectIdea: payload.projectIdea?.trim(),
      createdAt: now,
      updatedAt: now
    };

    // Update local state immediately
    setRegistrations(prev => [newRegistration, ...prev.filter(r => r.registrationId !== newId)]);
    setCurrentRegistrationId(newId);

    // Automatically set logged in team leader
    setLoggedInTeam(newRegistration);
    setCurrentUser({
      uid: newId,
      email: newRegistration.teamLeader.email,
      displayName: newRegistration.teamLeader.name
    });
    localStorage.setItem(TEAM_AUTH_KEY, newId);

    // Save directly to Firebase Firestore
    try {
      setIsFirebaseSyncing(true);
      await saveRegistrationToFirestore(newRegistration);
    } catch (fbError) {
      console.warn('Firebase save error (saved locally):', fbError);
    } finally {
      setIsFirebaseSyncing(false);
    }

    return {
      success: true,
      registrationId: newId
    };
  };

  const updateRegistrationStatus = async (
    id: string,
    status: RegistrationStatus,
    notes?: string,
    reviewer: string = 'admin_super_01'
  ) => {
    const now = new Date().toISOString();
    
    // Update local state
    setRegistrations(prev =>
      prev.map(reg => {
        if (reg.registrationId === id) {
          const updated = {
            ...reg,
            status,
            adminNotes: notes !== undefined ? notes : reg.adminNotes,
            reviewedBy: reviewer,
            reviewedAt: now,
            updatedAt: now
          };
          if (loggedInTeam?.registrationId === id) {
            setLoggedInTeam(updated);
          }
          return updated;
        }
        return reg;
      })
    );

    // Update in Firebase Firestore
    try {
      await updateRegistrationStatusInFirestore(id, status, notes, reviewer);
    } catch (err) {
      console.warn('Firestore update status failed:', err);
    }
  };

  const deleteRegistration = async (id: string) => {
    setRegistrations(prev => prev.filter(reg => reg.registrationId !== id));
    if (loggedInTeam?.registrationId === id) {
      logoutTeamLeader();
    }
    try {
      await deleteRegistrationFromFirestore(id);
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
  };

  const updateTeamRegistration = async (updatedReg: RegistrationData): Promise<{ success: boolean; error?: string }> => {
    if (updatedReg.teamSize < 2 || updatedReg.teamSize > 4) {
      return {
        success: false,
        error: 'Team size must be between 2 and 4 members (minimum 1 leader + 1 member, maximum 1 leader + 3 members).'
      };
    }

    const expectedMembersCount = updatedReg.teamSize - 1;
    if (updatedReg.members.length !== expectedMembersCount) {
      return {
        success: false,
        error: `For a team size of ${updatedReg.teamSize}, exactly ${expectedMembersCount} team member${expectedMembersCount > 1 ? 's are' : ' is'} required (plus the Team Leader).`
      };
    }

    for (let i = 0; i < updatedReg.members.length; i++) {
      const m = updatedReg.members[i];
      if (!m.name.trim()) {
        return { success: false, error: `Member #${i + 1} name cannot be empty.` };
      }
      if (!m.rollNumber.trim()) {
        return { success: false, error: `Member #${i + 1} roll number cannot be empty.` };
      }
      if (!m.department.trim()) {
        return { success: false, error: `Member #${i + 1} department cannot be empty.` };
      }
    }

    const now = new Date().toISOString();
    const finalReg: RegistrationData = {
      ...updatedReg,
      members: updatedReg.members.map((m, idx) => ({
        ...m,
        id: m.id || `m_${idx + 1}_${Date.now()}`,
        name: m.name.trim(),
        rollNumber: m.rollNumber.trim().toUpperCase(),
        department: m.department.trim(),
        email: m.email?.trim().toLowerCase()
      })),
      updatedAt: now
    };

    setRegistrations(prev => prev.map(r => r.registrationId === finalReg.registrationId ? finalReg : r));
    if (loggedInTeam?.registrationId === finalReg.registrationId) {
      setLoggedInTeam(finalReg);
    }

    try {
      setIsFirebaseSyncing(true);
      await saveRegistrationToFirestore(finalReg);
    } catch (err) {
      console.warn('Failed to update Firestore, updated locally:', err);
    } finally {
      setIsFirebaseSyncing(false);
    }

    return { success: true };
  };

  const getRegistrationById = (id: string) => {
    return registrations.find(r => r.registrationId === id);
  };

  // User Auth Actions
  const loginUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await firebaseSignIn(email, password);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message?.replace('Firebase: ', '') || 'Invalid email or password.'
      };
    }
  };

  const signupUser = async (email: string, password: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await firebaseSignUp(email, password, displayName);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message?.replace('Firebase: ', '') || 'Failed to create account.'
      };
    }
  };

  const logout = async () => {
    logoutTeamLeader();
    try {
      await firebaseSignOut();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    logoutAdmin();
  };

  // Admin Login Action
  const loginAdmin = (password: string, email: string = 'admin@vardhaman.org'): boolean => {
    if (password === 'blocknova2026' || password === 'admin123' || password === 'algorand2026') {
      setIsAdminAuthenticated(true);
      setAdminUser({ email, role: 'superadmin' });
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        localStorage.removeItem(ADMIN_AUTH_KEY);
      } catch (e) {
        console.warn('Failed to save admin session', e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (e) {
      console.warn('Failed to clear admin session', e);
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        problemStatements,
        activeCategory,
        setActiveCategory,
        selectedProblemStatement,
        setSelectedProblemStatement,
        currentRegistrationId,
        setCurrentRegistrationId,
        submitRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        getRegistrationById,
        checkTeamNameAvailable,
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        selectedPSForRegistration,
        setSelectedPSForRegistration,
        isPSReleased,
        setMasterPSReleased,
        updateProblemStatementLimit,
        toggleProblemStatementRelease,
        selectTeamProblemStatement,
        unassignTeamProblemStatement,
        getPSSelectionStats,
        getAllPSSelectionStats,
        loggedInTeam,
        currentUser,
        authLoading,
        isFirebaseSyncing,
        loginTeamLeader,
        logoutTeamLeader,
        updateTeamRegistration,
        loginUser,
        signupUser,
        logout
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
