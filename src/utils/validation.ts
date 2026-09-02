import { RegistrationData, TeamMember, TeamLeader } from '../types';
import jsPDF from 'jspdf';

// Email regex validation
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
};

// Phone validation (strictly numeric with optional country code, 10 to 15 digits)
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-().+]/g, '');
  // Must only contain digits now
  if (!/^\d+$/.test(cleaned)) return false;
  // Standard Indian mobile number (10 digits starting with 6-9, or with country code 91)
  const indianMobile = /^(\+?91)?[6-9]\d{9}$/.test(phone.replace(/[\s\-()]/g, ''));
  return indianMobile || (cleaned.length >= 10 && cleaned.length <= 15);
};

// Roll number check (min 3 chars)
export const isValidRollNumber = (roll: string): boolean => {
  return typeof roll === 'string' && roll.trim().length >= 3;
};

// Format sequential registration ID e.g., BNH26-0001 (safely scans existing IDs to prevent collisions)
export const generateRegistrationId = (source: RegistrationData[] | number): string => {
  if (typeof source === 'number') {
    const nextNum = Math.max(1, source + 1);
    const padded = String(nextNum).padStart(4, '0');
    return `BNH26-${padded}`;
  }

  let maxId = 0;
  if (Array.isArray(source)) {
    for (const reg of source) {
      if (reg && reg.registrationId && reg.registrationId.startsWith('BNH26-')) {
        const numPart = parseInt(reg.registrationId.replace('BNH26-', ''), 10);
        if (!isNaN(numPart) && numPart > maxId) {
          maxId = numPart;
        }
      }
    }
  }

  const nextNum = Math.max(maxId + 1, (Array.isArray(source) ? source.length : 0) + 1);
  const padded = String(nextNum).padStart(4, '0');
  return `BNH26-${padded}`;
};

// Check if team name already exists (case-insensitive & whitespace trimmed)
export const isTeamNameTaken = (
  teamName: string,
  existingRegistrations: RegistrationData[],
  currentRegId?: string
): boolean => {
  if (!teamName || typeof teamName !== 'string') return false;
  const normalized = teamName.trim().toLowerCase();
  return existingRegistrations.some((reg) => {
    if (!reg || reg.registrationId === currentRegId) return false;
    const existingNameLower = (reg.teamNameLower || reg.teamName || '').trim().toLowerCase();
    return existingNameLower === normalized;
  });
};

// Check if a roll number is already registered across any team
export const isRollNumberRegistered = (
  rollNumber: string,
  existingRegistrations: RegistrationData[],
  currentRegId?: string
): { isDuplicate: boolean; registeredTeam?: string } => {
  if (!rollNumber || typeof rollNumber !== 'string') return { isDuplicate: false };
  const normalized = rollNumber.trim().toUpperCase();
  if (!normalized) return { isDuplicate: false };

  for (const reg of existingRegistrations) {
    if (!reg || reg.registrationId === currentRegId) continue;
    if (reg.teamLeader?.rollNumber?.trim().toUpperCase() === normalized) {
      return { isDuplicate: true, registeredTeam: reg.teamName };
    }
    if (Array.isArray(reg.members)) {
      for (const m of reg.members) {
        if (m?.rollNumber?.trim().toUpperCase() === normalized) {
          return { isDuplicate: true, registeredTeam: reg.teamName };
        }
      }
    }
  }
  return { isDuplicate: false };
};

// Client-side PDF generator for the team registration confirmation pass
export const downloadRegistrationPassPDF = (registration: RegistrationData) => {
  try {
    const doc = new jsPDF();

    // Background header band
    doc.setFillColor(15, 17, 36);
    doc.rect(0, 0, 210, 45, 'F');

    // Header text
    doc.setTextColor(0, 240, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BLOCKNOVA HACKATHON 2026', 105, 18, { align: 'center' });

    doc.setTextColor(200, 210, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Organized by Algorand Blockchain Club | Vardhaman College of Engineering', 105, 26, { align: 'center' });
    doc.text('Dates: September 18 - 19, 2026 | Hyderabad, India', 105, 33, { align: 'center' });

    // Official Pass Title
    doc.setTextColor(20, 20, 40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL TEAM REGISTRATION PASS', 105, 56, { align: 'center' });

    // Registration ID Box
    doc.setFillColor(240, 245, 255);
    doc.setDrawColor(99, 102, 241);
    doc.roundedRect(15, 62, 180, 24, 3, 3, 'FD');

    doc.setTextColor(79, 70, 229);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL REGISTRATION IDENTIFIER:', 105, 71, { align: 'center' });
    doc.setFontSize(16);
    doc.text(registration.registrationId, 105, 80, { align: 'center' });

    // Team Summary Table
    let y = 96;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    const addRow = (label: string, value: string, maxWidth: number = 115) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value || 'N/A', maxWidth);
      doc.text(lines, 75, y);
      y += Math.max(7, lines.length * 5 + 2);
    };

    addRow('Team Name:', registration.teamName);
    addRow('College / Institution:', registration.collegeName);
    addRow('Location:', `${registration.collegeCity || 'Hyderabad'}, ${registration.collegeState || 'Telangana'}`);
    addRow('Total Team Size:', `${registration.teamSize} Members`);
    addRow('Selected Problem Statement:', registration.problemStatementId || 'Open Track / To be finalized');
    const validDate = registration.createdAt ? new Date(registration.createdAt) : new Date();
    addRow('Registration Date:', isNaN(validDate.getTime()) ? new Date().toLocaleString('en-IN') : validDate.toLocaleString('en-IN'));

    // Divider line
    y += 2;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, 195, y);
    y += 8;

    // Team Leader Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text('Team Leader Details', 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    addRow('Name & Year:', `${registration.teamLeader.name} (${registration.teamLeader.year})`);
    addRow('Roll Number:', registration.teamLeader.rollNumber);
    addRow('Branch / Dept:', registration.teamLeader.department || 'Not specified');
    addRow('Email & Phone:', `${registration.teamLeader.email} | ${registration.teamLeader.phone}`);

    // Members Section
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text(`Team Members (${registration.members ? registration.members.length : 0})`, 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    if (Array.isArray(registration.members)) {
      registration.members.forEach((m, idx) => {
        addRow(`Member ${idx + 1}:`, `${m.name} | ${m.year} | Roll: ${m.rollNumber} | Dept: ${m.department || 'N/A'}`);
      });
    }

    // Venue & Instructions Box
    y += 4;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, y, 180, 36, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('IMPORTANT EVENT GUIDELINES:', 20, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('1. Please carry this pass and your official college student ID card during on-campus check-in.', 20, y + 14);
    doc.text('2. Venue: Vardhaman College of Engineering, Kacharam, Shamshabad, Hyderabad - 501218.', 20, y + 20);
    doc.text('3. Reporting Time: Sep 18, 2026 at 09:00 AM IST. Note: No accommodation and no food provided.', 20, y + 26);
    doc.text('4. For queries, contact Algorand Blockchain Club at indlabharath999@gmail.com or +91 7997885525.', 20, y + 32);

    // Save PDF
    const safeTeamName = (registration.teamName || 'Team').replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`BlockNova_Registration_${registration.registrationId}_${safeTeamName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF pass:', error);
    // Fallback to window print
    window.print();
  }
};
