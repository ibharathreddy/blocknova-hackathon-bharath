export type AppView = 'home' | 'about' | 'schedule' | 'faq' | 'register' | 'login' | 'admin-login' | 'admin';

export interface UserAuthProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous?: boolean;
}

export type TeamSize = 2 | 3 | 4;

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface TeamMember {
  id?: string;
  name: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | string;
  rollNumber: string;
  department: string;
  email?: string;
}

export interface TeamLeader {
  name: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | string;
  rollNumber: string;
  department: string;
  email: string;
  phone: string;
}

export interface RegistrationData {
  registrationId: string;
  status: RegistrationStatus;
  collegeName: string;
  collegeCity?: string;
  collegeState?: string;
  teamName: string;
  teamNameLower: string;
  teamSize: TeamSize;
  teamLeader: TeamLeader;
  members: TeamMember[];
  problemStatementId?: string;
  projectIdea?: string;
  createdAt: string; // ISO string
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export interface ProblemStatement {
  psId: string;
  title: string;
  category: 'Blockchain' | 'AI' | 'Cybersecurity' | 'FinTech' | 'Web3' | 'Open Innovation' | string;
  shortDescription: string;
  fullDescription: string;
  expectedOutcome: string;
  requirements: string[];
  constraints: string[];
  suggestedTech: string[];
  evaluationCriteria: string;
  isActive: boolean;
  order?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Advanced';
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'title' | 'powered_by' | 'community' | 'track_partner';
  tierLabel: string;
  logoUrl: string;
  websiteUrl: string;
  tagline?: string;
}

export interface TimelineEvent {
  phase: number;
  title: string;
  time?: string;
  date?: string;
  description: string;
  tag?: string;
  iconName: string;
}

export interface ScheduleItem {
  day: 'Day 1 (Sep 18)' | 'Day 2 (Sep 19)';
  time: string;
  title: string;
  description: string;
  category: 'Keynote' | 'Hacking' | 'Mentorship' | 'Food' | 'Judging' | 'Ceremony';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'General' | 'Registration' | 'Technical' | 'Logistics';
}

export interface EvaluationCriterion {
  category: string;
  weight: number;
  description: string;
}
