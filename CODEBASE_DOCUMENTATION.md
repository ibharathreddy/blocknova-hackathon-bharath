# BlockNova 2026 — Technical Architecture & Code Cleanup Guide

This document explains what libraries, components, and utilities are used in the **BlockNova 2026 Hackathon** application, why they were chosen, and details the code cleanups performed across the project.

---

## 1. Core Technology Stack & Dependencies

| Tool / Library | Role & Purpose | Why It Is Used |
| :--- | :--- | :--- |
| **React 18** | UI Library | Component-driven structure, fast re-rendering, and declarative UI development. |
| **TypeScript** | Static Typing | Ensures strict type safety across registration objects, problem statements, and prop interfaces. |
| **Vite 6** | Build Tool / Dev Server | Provides instantaneous HMR (Hot Module Replacement) and fast production bundling. |
| **Tailwind CSS** | Styling Framework | Enables dark-mode styling, glassmorphism (`glass-card`, `glass-nav`), and glow utility effects without writing heavy custom CSS. |
| **Lucide React** | Icon System | Lightweight SVG icon library for navigation, status badges, timeline nodes, and action buttons. |
| **Canvas Confetti** | Celebration Animation | Triggers celebratory confetti upon successful team registration submission. |
| **jsPDF** | PDF Pass Generation | Generates and downloads official printable PDF registration passes for confirmed hacker teams. |

---

## 2. Component & Architecture Breakdown

### 2.1 State Management & Routing
- **[`RegistrationContext.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/context/RegistrationContext.tsx)**
  - **What it does**: Provides a central React Context store for team registrations, admin authentication state (`isAdminAuthenticated`), active problem statement selections, and CRUD operations.
  - **Why it is used**: Prevents prop-drilling across multi-step registration forms and admin dashboard views.

- **[`App.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/App.tsx)**
  - **What it does**: Manages view state (`home`, `about`, `event-details`, `schedule`, `faq`, `register`, `admin`, `admin-login`) and syncs hash URLs (`#register`, `#admin`, `#about`, etc.).
  - **Why it is used**: Serves as the single-page application router and top-level layout wrapper.

---

### 2.2 Navigation & Layout
- **[`Navbar.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/layout/Navbar.tsx)**
  - Sticky frosted header (`glass-nav`) with logo, section navigation links, mobile drawer menu, and quick action CTAs.
- **[`Footer.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/layout/Footer.tsx)**
  - Global footer displaying organizing body details (Algorand Blockchain Club & VCE), social media links, quick navigation, and organizer access link.

---

### 2.3 Home Page Components
- **[`HeroSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/HeroSection.tsx)**: Main hero landing with headline, key statistics (500+ Innovators, ₹1 Lakh+ Prizes), countdown embed, and registration CTAs.
- **[`CountdownTimer.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/CountdownTimer.tsx)**: Calculates real-time countdown to event kickoff on `2026-09-18T09:00:00+05:30`.
- **[`AboutSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/AboutSection.tsx)**: Highlights mission, vision, technical highlights (Algorand Pure Proof-of-Stake, Sub-4.5s finality), and eligibility criteria.
- **[`EventDetails.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/EventDetails.tsx)**: Tabular specification of hackathon rules, venue specs, and hacker perks.
- **[`ProblemStatements.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/ProblemStatements.tsx)**: Phase 2 teaser card announcing problem statement track releases scheduled for September 16, 2026.
- **[`PrizesSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/PrizesSection.tsx)**: Podium grid displaying Champion, 2nd, and 3rd rank prizes, cash awards, and trophies.
- **[`SponsorsSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/SponsorsSection.tsx)**: Partner showcase highlighting Title Sponsor (Algorand Foundation) and community organizers.
- **[`VenueSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/VenueSection.tsx)**: Interactive Google Maps iframe, venue address, campus hackathon zones, and transit guide.
- **[`EventScheme.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/EventScheme.tsx)**: 7-phase operational roadmap from registration to grand finale.
- **[`ScheduleTimeline.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/ScheduleTimeline.tsx)**: Day 1 vs Day 2 filterable hour-by-hour timeline.
- **[`FAQSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/FAQSection.tsx)**: Searchable and category-filterable accordion FAQ interface.

---

### 2.4 Registration Flow
- **[`RegistrationWizard.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/RegistrationWizard.tsx)**: Stepper wizard enforcing strict 2 to 4 team members constraint.
- **[`StepCollege.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/StepCollege.tsx)**: Step 1 — College/Institution input with autocomplete suggestions.
- **[`StepTeam.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/StepTeam.tsx)**: Step 2 — Real-time team name uniqueness check & team size selector (2, 3, 4).
- **[`StepLeader.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/StepLeader.tsx)**: Step 3 — Leader contact details and roll number validation.
- **[`StepMembers.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/StepMembers.tsx)**: Step 4 — Dynamic member input forms adapted to selected team size.
- **[`StepReview.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/StepReview.tsx)**: Step 5 — Final confirmation and team summary before submission.
- **[`RegistrationSuccess.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/RegistrationSuccess.tsx)**: Confirmation view with downloadable PDF registration pass and celebration confetti.

---

### 2.5 Organizer Admin Portal
- **[`AdminLogin.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/admin/AdminLogin.tsx)**: Password-protected login portal.
- **[`AdminDashboard.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/admin/AdminDashboard.tsx)**: Management dashboard with search, status filtering, approval/rejection toggles, and CSV export.
- **[`RegistrationDetailModal.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/admin/RegistrationDetailModal.tsx)**: Deep-inspection modal for reviewing team submissions and editing admin notes.

---

## 3. Code Cleanup & Optimization Summary

The following redundant imports, unrendered components, and dead properties were removed/integrated to streamline the codebase:

### 1. [`App.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/App.tsx)
- **Removed/Fixed**: `VenueSection` was imported but omitted from the home page render tree.
- **Why**: `<VenueSection />` was added to the home view so users can view the campus map and location details directly.

### 2. [`SponsorsSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/SponsorsSection.tsx)
- **Updated**: Created a large, prominent Title Sponsor card featuring the official vector **Algorand logo**. Removed the 4 partner cards below it to keep the title sponsor card clean and standalone.

### 3. [`VenueSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/VenueSection.tsx)
- **Removed**: Completely removed from the application views as requested.

### 3. [`PrizesSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/PrizesSection.tsx)
- **Removed**: Unused Lucide icons (`Medal`, `Award`, `Gift`, `Zap`, `Coins`, `Flame`, `Sparkles`, `Check`), unused data imports (`SPECIAL_TRACK_PRIZES`, `EVENT_CONFIG`), bulleted perks list (`<ul>`), and bottom certificate note footer.
- **Why**: Simplified prize cards to keep them clean, focused, and displaying strictly the rank, title, and cash prize amounts (`₹50,000`, `₹30,000`, `₹20,000`).

### 4. [`AboutSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/AboutSection.tsx)
- **Removed**: Unused import `EVENT_CONFIG`.
- **Why**: Not referenced within the component template.

### 5. [`Navbar.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/layout/Navbar.tsx)
- **Removed**: Unused imports `MapPin` and `EVENT_CONFIG`.
- **Why**: Cleaned up unused symbol references.

### 6. [`HeroSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/HeroSection.tsx)
- **Removed**: Unused imports `Users`, `FileCode`, and `EVENT_CONFIG`.
- **Why**: Symbols were imported but unused in JSX rendering.

### 7. [`CountdownTimer.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/CountdownTimer.tsx)
- **Removed**: Unused `glow` key inside the `timeUnits` object array.
- **Why**: The `glow` property was defined on array items but never consumed in the UI template.

### 8. [`FAQSection.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/FAQSection.tsx)
- **Removed**: Unused Lucide import `Sparkles`.
- **Why**: Cleaned up unused icon import.

### 9. [`ScheduleTimeline.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/home/ScheduleTimeline.tsx)
- **Removed**: Unused Lucide import `CheckCircle`.
- **Why**: Cleaned up unused icon import.

### 10. [`RegistrationWizard.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/RegistrationWizard.tsx)
- **Removed/Fixed**: Removed unused `Sparkles` icon import. Integrated the step `Icon` into the stepper button label.
- **Why**: Utilized the `step.icon` prop and removed dead imports.

### 11. [`StepTeam.tsx`](file:///c:/Users/Nikhil/OneDrive/Desktop/projects/ABC/blocknova-hackathon/src/components/registration/StepTeam.tsx)
- **Removed**: Unused Lucide imports `FileCode2` and `Sparkles`.
- **Why**: Cleaned up unused icon imports.
