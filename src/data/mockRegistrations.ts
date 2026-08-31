import { RegistrationData } from '../types';

export const INITIAL_REGISTRATIONS: RegistrationData[] = [
  {
    registrationId: 'BNH26-0001',
    status: 'approved',
    collegeName: 'Vardhaman College of Engineering',
    collegeCity: 'Hyderabad',
    collegeState: 'Telangana',
    teamName: 'Team AlgoPioneers',
    teamNameLower: 'team algopioneers',
    teamSize: 4,
    teamLeader: {
      name: 'Bharath Reddy',
      year: '3rd Year',
      rollNumber: '22881A05F2',
      department: 'Computer Science and Engineering',
      email: 'bharath.reddy@vardhaman.org',
      phone: '+91 98765 12345'
    },
    members: [
      {
        id: 'm1',
        name: 'Aishwarya Kulkarni',
        year: '3rd Year',
        rollNumber: '22881A0504',
        department: 'Computer Science and Engineering',
        email: 'aishwarya.k@vardhaman.org'
      },
      {
        id: 'm2',
        name: 'Rohan Sharma',
        year: '2nd Year',
        rollNumber: '23881A1245',
        department: 'Information Technology',
        email: 'rohan.sharma@vardhaman.org'
      },
      {
        id: 'm3',
        name: 'Nikhil Verma',
        year: '3rd Year',
        rollNumber: '22881A0432',
        department: 'Electronics & Communication',
        email: 'nikhil.v@vardhaman.org'
      }
    ],
    problemStatementId: 'PS-01',
    projectIdea: 'Developing an automated carbon footprint tracking oracle coupled with Algorand smart contracts for green campus audits.',
    createdAt: '2026-08-25T10:15:00Z',
    updatedAt: '2026-08-26T14:20:00Z',
    reviewedBy: 'admin_super_01',
    reviewedAt: '2026-08-26T14:20:00Z',
    adminNotes: 'Strong team composition with prior hackathon experience on Algorand testnet.'
  },
  {
    registrationId: 'BNH26-0002',
    status: 'pending',
    collegeName: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    collegeCity: 'Hyderabad',
    collegeState: 'Telangana',
    teamName: 'CipherZero',
    teamNameLower: 'cipherzero',
    teamSize: 3,
    teamLeader: {
      name: 'Sneha Rao',
      year: '4th Year',
      rollNumber: '160121733088',
      department: 'Computer Science & AI',
      email: 'sneha.rao@cbit.ac.in',
      phone: '+91 99481 67890'
    },
    members: [
      {
        id: 'm1',
        name: 'Tarun Tej',
        year: '4th Year',
        rollNumber: '160121733102',
        department: 'Computer Science',
        email: 'tarun.tej@cbit.ac.in'
      },
      {
        id: 'm2',
        name: 'Harika Malladi',
        year: '3rd Year',
        rollNumber: '160122733054',
        department: 'Artificial Intelligence & Data Science',
        email: 'harika.m@cbit.ac.in'
      }
    ],
    problemStatementId: 'PS-02',
    projectIdea: 'AST-based static analyzer augmented by fine-tuned LLMs to detect reentrancy and integer overflow in PyTeal/Solidity.',
    createdAt: '2026-08-27T11:45:00Z',
    updatedAt: '2026-08-27T11:45:00Z'
  },
  {
    registrationId: 'BNH26-0003',
    status: 'approved',
    collegeName: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    collegeCity: 'Hyderabad',
    collegeState: 'Telangana',
    teamName: 'Novatrix',
    teamNameLower: 'novatrix',
    teamSize: 4,
    teamLeader: {
      name: 'Aditya Kashyap',
      year: '3rd Year',
      rollNumber: '22071A6705',
      department: 'Data Science & Cyber Security',
      email: 'aditya.kashyap@vnrvjiet.in',
      phone: '+91 91234 56789'
    },
    members: [
      {
        id: 'm1',
        name: 'Pranavi Joshi',
        year: '3rd Year',
        rollNumber: '22071A6732',
        department: 'Cyber Security',
        email: 'pranavi.j@vnrvjiet.in'
      },
      {
        id: 'm2',
        name: 'Gautam Menon',
        year: '3rd Year',
        rollNumber: '22071A0589',
        department: 'Computer Science',
        email: 'gautam.m@vnrvjiet.in'
      },
      {
        id: 'm3',
        name: 'Divya Reddy',
        year: '2nd Year',
        rollNumber: '23071A0512',
        department: 'Computer Science',
        email: 'divya.reddy@vnrvjiet.in'
      }
    ],
    problemStatementId: 'PS-04',
    projectIdea: 'Zero-Knowledge academic credential issuance and verification portal with instant mobile QR scanning.',
    createdAt: '2026-08-28T09:30:00Z',
    updatedAt: '2026-08-29T10:00:00Z',
    reviewedBy: 'admin_super_01',
    reviewedAt: '2026-08-29T10:00:00Z',
    adminNotes: 'Verified institute credentials.'
  },
  {
    registrationId: 'BNH26-0004',
    status: 'pending',
    collegeName: 'Vardhaman College of Engineering',
    collegeCity: 'Hyderabad',
    collegeState: 'Telangana',
    teamName: 'BlockForge',
    teamNameLower: 'blockforge',
    teamSize: 2,
    teamLeader: {
      name: 'Karthik Varma',
      year: '2nd Year',
      rollNumber: '23881A0567',
      department: 'Computer Science and Engineering',
      email: 'karthik.varma@vardhaman.org',
      phone: '+91 98877 66554'
    },
    members: [
      {
        id: 'm1',
        name: 'Sumanth Goud',
        year: '2nd Year',
        rollNumber: '23881A0589',
        department: 'Computer Science and Engineering',
        email: 'sumanth.g@vardhaman.org'
      }
    ],
    problemStatementId: 'PS-03',
    projectIdea: 'Decentralized reputation-based micro-lending pool for college student projects.',
    createdAt: '2026-08-29T15:00:00Z',
    updatedAt: '2026-08-29T15:00:00Z'
  },
  {
    registrationId: 'BNH26-0005',
    status: 'rejected',
    collegeName: 'Osmania University College of Engineering',
    collegeCity: 'Hyderabad',
    collegeState: 'Telangana',
    teamName: 'CryptoCrew',
    teamNameLower: 'cryptocrew',
    teamSize: 2,
    teamLeader: {
      name: 'Vikram Chandra',
      year: '1st Year',
      rollNumber: '100524733012',
      department: 'Mechanical Engineering',
      email: 'vikram.chandra@osmania.ac.in',
      phone: '+91 90000 11223'
    },
    members: [
      {
        id: 'm1',
        name: 'Test Member',
        year: '1st Year',
        rollNumber: '100524733013',
        department: 'Mechanical',
        email: 'test@invalid.domain'
      }
    ],
    problemStatementId: 'PS-05',
    projectIdea: 'Incomplete project description and invalid member contact details.',
    createdAt: '2026-08-29T16:20:00Z',
    updatedAt: '2026-08-29T17:00:00Z',
    reviewedBy: 'admin_reviewer_02',
    reviewedAt: '2026-08-29T17:00:00Z',
    adminNotes: 'Invalid member email and duplicate roll number format.'
  }
];
