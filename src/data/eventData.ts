import { FAQItem, ScheduleItem, Sponsor, TimelineEvent, EvaluationCriterion } from '../types';

export const EVENT_CONFIG = {
  name: 'BlockNova Hackathon 2026',
  shortName: 'BlockNova',
  tagline: 'Build. Innovate. Decentralize.',
  collegeName: 'Vardhaman College of Engineering',
  collegeShort: 'VCE Hyderabad',
  clubName: 'Algorand Blockchain Club',
  sponsoredBy: 'Algorand',
  dates: 'September 18 – 19, 2026',
  // Target date for countdown: Sep 18, 2026 09:00:00 IST
  startDateISO: '2026-09-18T09:00:00+05:30',
  endDateISO: '2026-09-19T18:00:00+05:30',
  registrationDeadlineISO: '2026-09-15T23:59:59+05:30',
  prizePool: '₹10,000+',
  firstPrize: '₹5,000',
  secondPrize: '₹3,000',
  thirdPrize: '₹2,000',
  teamSizeRange: '2 – 4 Members',
  minTeamSize: 2,
  maxTeamSize: 4,
  durationHours: '36 Hours',
  mode: 'Offline (On-Campus)',
  venueName: 'Vardhaman College of Engineering',
  venueHall: 'Central Auditorium & CSE Advanced Innovation Labs',
  venueAddress: 'Kacharam, Shamshabad, Hyderabad, Telangana 501218',
  contactEmail: 'indlabharath999@gmail.com',
  contactPhone: '+91 7997885525',
  socialLinks: {
    instagram: 'https://instagram.com/algorand_vce',
    linkedin: 'https://linkedin.com/school/vardhaman-college-of-engineering',
    x: 'https://x.com/Algorand',
    github: 'https://github.com/algorand-blockchain-club',
    discord: 'https://discord.gg/algorand'
  }
};

export const TIMELINE_PHASES: TimelineEvent[] = [
  {
    phase: 1,
    title: 'Registration & Team Formation',
    time: 'Aug 20 – Sep 15, 2026',
    description: 'Teams register on the official portal, specify team members (2–4), and receive their unique BNH26 registration ID.',
    tag: 'Active Now',
    iconName: 'UserCheck'
  },
  {
    phase: 2,
    title: 'Problem Statement Selection',
    time: 'Sep 16 – Sep 17, 2026',
    description: 'Teams finalize their chosen problem statement track and attend the online technical primer workshop.',
    tag: 'Upcoming',
    iconName: 'FileCode2'
  },
  {
    phase: 3,
    title: 'Opening Ceremony & Hacking Begins',
    time: 'Sep 18, 09:00 AM',
    description: 'Keynote by Algorand ecosystem leads, prompt release, and 36-hour hacking clock officially starts.',
    tag: 'Day 1',
    iconName: 'Flame'
  },
  {
    phase: 4,
    title: 'Mentorship Rounds & Midnight Checkpoint',
    time: 'Sep 18, 04:00 PM – 11:00 PM',
    description: 'Industry experts and Algorand mentors review prototypes, smart contracts, and architecture diagrams.',
    tag: 'Day 1 Night',
    iconName: 'Users'
  },
  {
    phase: 5,
    title: 'Code Freeze & GitHub Submissions',
    time: 'Sep 19, 02:00 PM',
    description: 'Final repository commits, smart contract deployment on Testnet, demo video, and presentation deck upload.',
    tag: 'Day 2',
    iconName: 'GitPullRequest'
  },
  {
    phase: 6,
    title: 'Preliminary Judging & Top 10 Pitches',
    time: 'Sep 19, 03:00 PM – 05:30 PM',
    description: 'Panel evaluation on innovation, technical depth, and live demonstration in front of jury.',
    tag: 'Day 2',
    iconName: 'Award'
  },
  {
    phase: 7,
    title: 'Grand Valedictory & Prize Distribution',
    time: 'Sep 19, 06:00 PM – 07:30 PM',
    description: 'Announcement of ₹10,000+ prize winners, track bounties, and distribution of official certificates.',
    tag: 'Finale',
    iconName: 'Trophy'
  }
];

export const EVALUATION_CRITERIA: EvaluationCriterion[] = [
  {
    category: 'Innovation & Novelty',
    weight: 20,
    description: 'Uniqueness of the idea, creative problem framing, and original approach to Web3/AI integration.'
  },
  {
    category: 'Technical Implementation',
    weight: 25,
    description: 'Code quality, smart contract architecture, integration of Algorand SDKs/AI APIs, and robustness.'
  },
  {
    category: 'Problem Relevance & Impact',
    weight: 20,
    description: 'Direct alignment with the selected problem statement, real-world utility, and market need.'
  },
  {
    category: 'User Experience & Design',
    weight: 15,
    description: 'Intuitiveness of the user interface, smooth user flows, responsiveness, and aesthetic polish.'
  },
  {
    category: 'Scalability & Security',
    weight: 10,
    description: 'System modularity, transaction cost optimization, and resilience against common security vulnerabilities.'
  },
  {
    category: 'Presentation & Demo',
    weight: 10,
    description: 'Clarity of the pitch, ability to answer technical cross-questions, and live functional product demo.'
  }
];

export const SCHEDULE_DATA: ScheduleItem[] = [
  // Day 1 (18 September 2026)
  {
    day: 'Day 1 (Sep 18)',
    time: '09:00 AM – 09:30 AM',
    title: 'Registration & Check-in',
    description: 'Badge distribution, verification of registration ID, and team desk allocation.',
    category: 'Keynote'
  },
  {
    day: 'Day 1 (Sep 18)',
    time: '09:30 AM – 10:15 AM',
    title: 'Opening Ceremony & Hackathon Kick-off',
    description: 'Opening Ceremony, Welcome Address, Introduction to Tracks & Rules, Mentor/Judge Introduction, and Hackathon Kick-off.',
    category: 'Ceremony'
  },
  {
    day: 'Day 1 (Sep 18)',
    time: '10:15 AM – 01:00 PM',
    title: 'Hacking Session – Phase 1',
    description: 'Ideation, architecture design, and initial project implementation sprint.',
    category: 'Hacking'
  },
  {
    day: 'Day 1 (Sep 18)',
    time: '01:00 PM – 01:45 PM',
    title: 'Lunch Break',
    description: 'Lunch break.',
    category: 'Food'
  },
  {
    day: 'Day 1 (Sep 18)',
    time: '01:45 PM – 04:00 PM',
    title: 'Hacking Session – Phase 2',
    description: 'Core feature development, smart contract coding, and integration sprint.',
    category: 'Hacking'
  },
  // Day 2 (19 September 2026)
  {
    day: 'Day 2 (Sep 19)',
    time: '09:00 AM – 11:00 AM',
    title: 'Hacking Session – Phase 3',
    description: 'Morning development sprint and feature completion.',
    category: 'Hacking'
  },
  {
    day: 'Day 2 (Sep 19)',
    time: '11:00 AM – 11:30 AM',
    title: 'Mentor Checkpoint',
    description: 'Technical reviews, MVP validation, and progress guidance with assigned mentors.',
    category: 'Mentorship'
  },
  {
    day: 'Day 2 (Sep 19)',
    time: '11:30 AM – 01:00 PM',
    title: 'Final Development & Code Freeze',
    description: 'Final code polish, testing, and code freeze preparation.',
    category: 'Hacking'
  },
  {
    day: 'Day 2 (Sep 19)',
    time: '01:00 PM – 01:30 PM',
    title: 'Project Submission & Documentation',
    description: 'Submission of GitHub repository links, documentation, and demo materials.',
    category: 'Hacking'
  },
  {
    day: 'Day 2 (Sep 19)',
    time: '01:30 PM – 02:00 PM',
    title: 'Lunch Break',
    description: 'Lunch break.',
    category: 'Food'
  },
  {
    day: 'Day 2 (Sep 19)',
    time: '02:00 PM – 04:00 PM',
    title: 'Project Demonstrations & Judging',
    description: 'Live project demonstrations and evaluation by the judging panel.',
    category: 'Judging'
  }
];

export const PRIZES_DATA = [
  {
    rank: '1st',
    title: 'Grand Champion',
    amount: '₹5000',
    color: 'from-amber-400 to-yellow-600',
    border: 'border-yellow-500/50',
    glow: 'shadow-yellow-500/20',
    perks: [
      '₹5000 Direct Cash Prize',
      'Winner Certificate of Merit'
    ]
  },
  {
    rank: '2nd',
    title: 'First Runner Up',
    amount: '₹3,000',
    color: 'from-slate-300 to-slate-500',
    border: 'border-slate-400/50',
    glow: 'shadow-slate-400/20',
    perks: [
      '₹3,000 Direct Cash Prize',
      'Certificate of Merit'
    ]
  },
  {
    rank: '3rd',
    title: 'Second Runner Up',
    amount: '₹2,000',
    color: 'from-amber-600 to-amber-800',
    border: 'border-amber-700/50',
    glow: 'shadow-amber-700/20',
    perks: [
      '₹2,000 Direct Cash Prize',
      'BlockNova Bronze Trophy',
      'Certificate of Merit'
    ]
  }
];

export const SPECIAL_TRACK_PRIZES = [
  {
    title: 'Best Algorand Native dApp',
    reward: '₹10,000 + Grant Support',
    desc: 'Awarded to the team with the most innovative use of Algorand smart contracts, ASA, or state proofs.'
  },
  {
    title: 'Best All-Women Led Team',
    reward: '₹10,000 + Special Swag',
    desc: 'Celebrating women in engineering and blockchain innovation.'
  },
  {
    title: 'Best UI/UX & Design Polish',
    reward: '₹5,000 + Pro Tool Licenses',
    desc: 'Recognizing outstanding user interface design and seamless Web3 user journey.'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'Who can participate in BlockNova 2026?',
    answer: 'BlockNova is open to all enrolled college students (undergraduate, postgraduate, or diploma) across India. Students from all branches (CSE, IT, ECE, EEE, Mechanical, etc.) and all academic years (1st to 4th year) are welcomed.'
  },
  {
    id: 'faq-2',
    category: 'Registration',
    question: 'What is the required team size?',
    answer: 'Teams must strictly comprise 2 to 4 members. Individual participation (1 member) or teams with more than 4 members are not allowed to ensure equitable collaboration.'
  },
  {
    id: 'faq-3',
    category: 'Registration',
    question: 'Can students from different colleges form a team?',
    answer: 'Yes! Cross-college and cross-department teams are completely allowed and encouraged. When registering, the team leader can input their primary college name while member details can specify respective institutions.'
  },
  {
    id: 'faq-4',
    category: 'Registration',
    question: 'Is there any registration fee?',
    answer: 'No. Registration for BlockNova 2026 is 100% free, sponsored by Algorand and Vardhaman College of Engineering.'
  },
  {
    id: 'faq-5',
    category: 'Registration',
    question: 'Can I change my team members or track after submitting registration?',
    answer: 'Yes! Team leaders can log in to the Team Leader Portal anytime using their registered email and name to edit team members, adjust team size (2 to 4), or update their selected problem statement track.'
  },
  {
    id: 'faq-6',
    category: 'Technical',
    question: 'Can we choose any technology or is Algorand mandatory?',
    answer: 'While projects building on the Algorand blockchain receive special consideration and qualify for exclusive Algorand track bounties, you are also free to choose any complementary technologies (AI, Python, Node, React, Cloud, Rust, IoT) to solve the selected problem statements.'
  },
  {
    id: 'faq-7',
    category: 'Technical',
    question: 'What deliverables should teams submit at the end of the hackathon?',
    answer: 'Teams must submit: (1) A public GitHub repository link with clean commits created during the hackathon window, (2) A deployed live demo / smart contract Testnet explorer link, (3) A 3–5 minute recorded demo or presentation slides.'
  },
  {
    id: 'faq-8',
    category: 'Logistics',
    question: 'Will food and accommodation be provided?',
    answer: 'No. Please note that no food and no accommodation will be provided for participants.'
  },
  {
    id: 'faq-9',
    category: 'Logistics',
    question: 'Will participation certificates be provided?',
    answer: 'Yes! All participants who check in at the venue and submit a verified project will receive an official verifiable digital Certificate of Participation issued by Algorand Blockchain Club & Vardhaman College of Engineering.'
  }
];

export const SPONSORS_DATA: Sponsor[] = [
  {
    id: 'sp-1',
    name: 'Algorand Foundation',
    tier: 'title',
    tierLabel: 'Title Sponsor',
    logoUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=200&auto=format&fit=crop&q=80',
    websiteUrl: 'https://algorand.co',
    tagline: 'The world’s most powerful, sustainable, and secure Layer-1 blockchain.'
  },
  {
    id: 'sp-2',
    name: 'Algorand Blockchain Club',
    tier: 'powered_by',
    tierLabel: 'Organized By',
    logoUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&auto=format&fit=crop&q=80',
    websiteUrl: 'https://vardhaman.org',
    tagline: 'Student-led blockchain innovation ecosystem at VCE.'
  },
  {
    id: 'sp-3',
    name: 'Vardhaman Center for Innovation & Incubation (VCII)',
    tier: 'powered_by',
    tierLabel: 'Institutional Partner',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
    websiteUrl: 'https://vardhaman.org',
    tagline: 'Nurturing student entrepreneurship and deep tech startups.'
  },
  {
    id: 'sp-4',
    name: 'GitHub Education',
    tier: 'community',
    tierLabel: 'Developer Partner',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=200&auto=format&fit=crop&q=80',
    websiteUrl: 'https://education.github.com',
    tagline: 'Developer student packs and repo infrastructure.'
  },
  {
    id: 'sp-5',
    name: 'Major League Hacking (MLH) Community',
    tier: 'community',
    tierLabel: 'Ecosystem Partner',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80',
    websiteUrl: 'https://mlh.io',
    tagline: 'Empowering the next generation of global student hackers.'
  }
];
