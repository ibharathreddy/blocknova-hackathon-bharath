import { RegistrationData, TeamMember, TeamLeader } from '../types';
import jsPDF from 'jspdf';

// Email regex validation
export const isValidEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
};

// Phone validation (10 digits minimum, optional +91 or country code)
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const re = /^(\+?\d{1,3})?[6-9]\d{9}$/;
  return re.test(cleaned) || cleaned.length >= 10;
};

// Roll number check (min 3 chars)
export const isValidRollNumber = (roll: string): boolean => {
  return typeof roll === 'string' && roll.trim().length >= 3;
};

// Format sequential registration ID e.g., BNH26-0001
export const generateRegistrationId = (currentCount: number): string => {
  const nextNum = currentCount + 1;
  const padded = String(nextNum).padStart(4, '0');
  return `BNH26-${padded}`;
};

// Check if team name already exists (case-insensitive)
export const isTeamNameTaken = (
  teamName: string,
  existingRegistrations: RegistrationData[],
  currentRegId?: string
): boolean => {
  const normalized = teamName.trim().toLowerCase();
  return existingRegistrations.some(
    (reg) => reg.teamNameLower === normalized && reg.registrationId !== currentRegId
  );
};

// Check if a roll number is already registered across any team
export const isRollNumberRegistered = (
  rollNumber: string,
  existingRegistrations: RegistrationData[],
  currentRegId?: string
): { isDuplicate: boolean; registeredTeam?: string } => {
  const normalized = rollNumber.trim().toUpperCase();
  for (const reg of existingRegistrations) {
    if (reg.registrationId === currentRegId) continue;
    if (reg.teamLeader.rollNumber.trim().toUpperCase() === normalized) {
      return { isDuplicate: true, registeredTeam: reg.teamName };
    }
    for (const m of reg.members) {
      if (m.rollNumber.trim().toUpperCase() === normalized) {
        return { isDuplicate: true, registeredTeam: reg.teamName };
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
    let y = 98;
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);

    const addRow = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 75, y);
      y += 8;
    };

    addRow('Team Name:', registration.teamName);
    addRow('College / Institution:', registration.collegeName);
    addRow('Location:', `${registration.collegeCity || 'Hyderabad'}, ${registration.collegeState || 'Telangana'}`);
    addRow('Total Team Size:', `${registration.teamSize} Members`);
    addRow('Selected Problem Statement:', registration.problemStatementId || 'Open Track / To be finalized');
    addRow('Registration Date:', new Date(registration.createdAt).toLocaleString('en-IN'));

    // Divider line
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, 195, y);
    y += 10;

    // Team Leader Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 138);
    doc.text('Team Leader Details', 20, y);
    y += 7;

    doc.setFontSize(10);
    addRow('Name & Year:', `${registration.teamLeader.name} (${registration.teamLeader.year})`);
    addRow('Roll Number:', registration.teamLeader.rollNumber);
    addRow('Branch / Dept:', registration.teamLeader.department || 'Not specified');
    addRow('Email & Phone:', `${registration.teamLeader.email} | ${registration.teamLeader.phone}`);

    // Members Section
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 138);
    doc.text(`Team Members (${registration.members.length})`, 20, y);
    y += 7;

    doc.setFontSize(10);
    registration.members.forEach((m, idx) => {
      addRow(`Member ${idx + 1}:`, `${m.name} | ${m.year} | Roll: ${m.rollNumber} | Dept: ${m.department || 'N/A'}`);
    });

    // Venue & Instructions Box
    y += 6;
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
    doc.text('3. Reporting Time: Sep 18, 2026 at 08:00 AM IST. Breakfast & badge pickup starts at 08:30 AM.', 20, y + 26);
    doc.text('4. For queries, contact Algorand Blockchain Club at blocknova@vardhaman.org or +91 98765 43210.', 20, y + 32);

    // Save PDF
    doc.save(`BlockNova_Registration_${registration.registrationId}_${registration.teamName.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF pass:', error);
    // Fallback to window print
    window.print();
  }
};
