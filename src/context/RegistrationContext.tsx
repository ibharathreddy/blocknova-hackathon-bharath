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

  const [problemStatements] = useState<ProblemStatement[]>(PROBLEM_STATEMENTS);
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

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<{ email: string; role: 'superadmin' | 'reviewer' } | null>(() => {
    if (localStorage.getItem(ADMIN_AUTH_KEY) === 'true') {
      return { email: 'admin@vardhaman.org', role: 'superadmin' };
    }
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
          // Merge firestore registrations with any local defaults
          setRegistrations((prevLocal) => {
            const combinedMap = new Map<string, RegistrationData>();
            // Add existing local registrations first
            prevLocal.forEach((r) => combinedMap.set(r.registrationId, r));
            // Overwrite with Firestore live registrations
            firestoreRegistrations.forEach((r) => combinedMap.set(r.registrationId, r));
            const merged = Array.from(combinedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            return merged;
          });

          // Also keep loggedInTeam state updated if current team changed in Firestore
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

  const checkTeamNameAvailable = (name: string, excludeId?: string): boolean => {
    return !isTeamNameTaken(name, registrations, excludeId);
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

    // 3. Generate sequential ID
    const newId = generateRegistrationId(registrations.length);
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
      problemStatementId: payload.problemStatementId || selectedPSForRegistration || undefined,
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
    // 1. Validate team size (min 2, max 4 members total including Leader)
    if (updatedReg.teamSize < 2 || updatedReg.teamSize > 4) {
      return {
        success: false,
        error: 'Team size must be between 2 and 4 members (minimum 1 leader + 1 member, maximum 1 leader + 3 members).'
      };
    }

    // 2. Validate members count matches teamSize - 1
    const expectedMembersCount = updatedReg.teamSize - 1;
    if (updatedReg.members.length !== expectedMembersCount) {
      return {
        success: false,
        error: `For a team size of ${updatedReg.teamSize}, exactly ${expectedMembersCount} team member${expectedMembersCount > 1 ? 's are' : ' is'} required (plus the Team Leader).`
      };
    }

    // 3. Validate member details
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

    // Update in local state
    setRegistrations(prev => prev.map(r => r.registrationId === finalReg.registrationId ? finalReg : r));
    if (loggedInTeam?.registrationId === finalReg.registrationId) {
      setLoggedInTeam(finalReg);
    }

    // Update in Firebase Firestore
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
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem(ADMIN_AUTH_KEY);
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
