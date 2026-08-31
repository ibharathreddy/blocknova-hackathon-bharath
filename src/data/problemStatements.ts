import { ProblemStatement } from '../types';

export const PROBLEM_STATEMENTS: ProblemStatement[] = [
  {
    psId: 'PS-01',
    title: 'Algorand Carbon Credit Verification & Micro-Offsetting dApp',
    category: 'Blockchain',
    shortDescription: 'Build a decentralized platform on Algorand to tokenize, verify, and trade real-time carbon offsets for green enterprises.',
    fullDescription: 'Traditional carbon credit markets suffer from double-counting, lack of transparency, high intermediary brokerage fees, and delayed settlement. Algorand’s carbon-negative Layer-1 blockchain provides the ideal substrate for instant finality and micro-transactions. This problem statement challenges teams to create an automated carbon credit issuance and trading protocol on Algorand Testnet with verified sensor/IoT or oracle data.',
    expectedOutcome: 'A fully functional dApp featuring ARC-03 / ARC-19 compliant smart contracts (PyTeal / Beaker), a verifiable audit trail for carbon sequestered, an automated minting pipeline, and a micro-offsetting widget for e-commerce checkouts.',
    requirements: [
      'Algorand Smart Contract (PyTeal or AlgoKit) for ASA (Algorand Standard Asset) fractional minting',
      'Integration with Pera Wallet or Defly Wallet for atomic transactions',
      'Verifiable telemetry ingestion pipeline (simulated IoT or oracle feed)',
      'Transparent on-chain ledger explorer and user portfolio dashboard'
    ],
    constraints: [
      'Sub-4.5 second transaction finality adherence on Algorand',
      'Zero double-claiming architecture using atomic transaction groups',
      'Responsive, accessible web frontend'
    ],
    suggestedTech: ['Algorand Python / PyTeal', 'AlgoKit', 'Pera Wallet SDK', 'React', 'TypeScript', 'Tailwind CSS'],
    evaluationCriteria: 'Smart contract security, mathematical accuracy of tokenized offset logic, UI/UX polish, and business viability.',
    isActive: true,
    order: 1,
    difficulty: 'Hard'
  },
  {
    psId: 'PS-02',
    title: 'AI-Powered Smart Contract Vulnerability Auditor & Fix Generator',
    category: 'AI',
    shortDescription: 'Develop an automated LLM-assisted security engine that scans smart contracts for reentrancy, integer overflows, and logic bugs.',
    fullDescription: 'Smart contract exploits result in hundreds of millions in losses annually. Existing static analyzers generate high false-positive rates and lack interactive remediation guidance. This challenge requires building an intelligent code intelligence tool combining AST parsing with specialized LLM embeddings to detect anti-patterns, explain vulnerabilities with PoC test vectors, and generate verified patched code.',
    expectedOutcome: 'A web-based scanner where developers paste or upload smart contracts (PyTeal, TEAL, Solidity, Rust) to receive a line-by-line security score, automated severity breakdown (Critical, High, Medium, Low), and 1-click suggested refactors.',
    requirements: [
      'Static analysis and AST token extraction engine',
      'Fine-tuned AI prompt/reasoning chain for smart contract exploit detection',
      'Interactive visual code diff showing identified flaw vs remediation',
      'Automated exportable PDF audit report with verification hash'
    ],
    constraints: [
      'Analysis turnaround time must be under 30 seconds for standard contracts',
      'Must provide reproducible exploit explanations, not just vague text'
    ],
    suggestedTech: ['FastAPI / Python', 'LangChain', 'OpenAI / Gemini API', 'React', 'Monaco Editor', 'Tailwind CSS'],
    evaluationCriteria: 'Precision of detected vulnerabilities, quality of generated patches, and intuitiveness of the developer workbench.',
    isActive: true,
    order: 2,
    difficulty: 'Hard'
  },
  {
    psId: 'PS-03',
    title: 'Decentralized Micro-Lending & Credit Scoring on Algorand',
    category: 'FinTech',
    shortDescription: 'Create a collateral-efficient DeFi lending protocol leveraging on-chain reputation and zero-knowledge identity proofs.',
    fullDescription: 'Millions of unbanked students and micro-entrepreneurs lack formal credit histories despite consistent digital cash flows. By synthesizing transaction velocity, ASA token tenure, and zero-knowledge verified academic/business credentials, teams must construct a decentralized micro-lending pool featuring automated yield distribution and dynamic interest tiers.',
    expectedOutcome: 'A non-custodial peer-to-peer liquidity pool on Algorand where borrowers generate reputation scores, request micro-loans, and lenders earn sustainable APY with automated liquidation safety nets.',
    requirements: [
      'Algorand State Proofs / Smart Contracts managing pool liquidity and escrow',
      'Reputation scoring algorithm evaluating multi-factor on-chain metrics',
      'Borrower request creation, repayment milestones, and automated interest calculation',
      'Seamless wallet connection and transparent transaction ledger'
    ],
    constraints: [
      'Must handle partial repayments and grace period states gracefully',
      'Protection against flash loan manipulation and sybil attacks'
    ],
    suggestedTech: ['Algorand PyTeal / Beaker', 'AlgoKit', 'Web3.js / Algorand SDK', 'Chart.js', 'React', 'TypeScript'],
    evaluationCriteria: 'Mathematical stability of the interest curves, contract robustness, and simplicity for non-crypto users.',
    isActive: true,
    order: 3,
    difficulty: 'Advanced'
  },
  {
    psId: 'PS-04',
    title: 'Zero-Knowledge Academic Credential & Skill Verification System',
    category: 'Cybersecurity',
    shortDescription: 'Build a tamper-proof student transcript and degree verification system using Algorand ASAs and ZK-SNARK identity proofs.',
    fullDescription: 'Educational credential forgery is an escalating global issue, while traditional verification requires weeks of manual correspondence. This project aims to empower universities like Vardhaman College of Engineering to issue cryptographically signed, immutable digital credentials that students can present to employers without revealing extraneous personal details (e.g. proving GPA > 8.0 without revealing exact marksheets).',
    expectedOutcome: 'An end-to-end portal consisting of: (1) University Issuer Dashboard for bulk credential stamping, (2) Student Identity Vault for storing cryptographic proofs, and (3) Employer Verification Portal for instantaneous QR/link verification.',
    requirements: [
      'Cryptographic hashing and on-chain anchoring of credential metadata on Algorand',
      'Zero-knowledge proof generator for selective attribute disclosure',
      'Instant QR Code scanner for employers and verification partners',
      'Revocation registry smart contract in case of academic misconduct'
    ],
    constraints: [
      'Zero exposure of sensitive PII (Personally Identifiable Information) on public ledger',
      'Verification check must execute in < 2 seconds'
    ],
    suggestedTech: ['Circom / SnarkJS', 'Algorand SDK', 'TypeScript', 'Node.js', 'React', 'QR Code Engine'],
    evaluationCriteria: 'Cryptographic soundness, privacy compliance, and usability for institutional administrators.',
    isActive: true,
    order: 4,
    difficulty: 'Medium'
  },
  {
    psId: 'PS-05',
    title: 'Decentralized Supply Chain Provenance & Cold-Chain IoT Tracker',
    category: 'Web3',
    shortDescription: 'Track pharmaceutical and food perishables with smart contract triggers for temperature and custody violations.',
    fullDescription: 'Counterfeit drugs and spoiled cold-chain supplies cost lives and billions in annual waste. By coupling simulated or real IoT temperature/GPS telemetry with Algorand smart contracts, this system autonomously records provenance handoffs and triggers automated escrow penalties or quarantine alerts when environmental thresholds are breached.',
    expectedOutcome: 'A real-time logistics dashboard showing geographical tracking, immutable telemetry logs, custody transfer approvals via multisig, and instant consumer authenticity verification via NFC/QR tags.',
    requirements: [
      'Multi-stakeholder custody workflow (Manufacturer -> Distributor -> Pharmacy -> Consumer)',
      'Algorand smart contract handling automated penalty slashing upon threshold breach',
      'Interactive map route visualizer with live sensor telemetry graph',
      'Public consumer lookup portal for batch recall validation'
    ],
    constraints: [
      'Optimized on-chain storage to minimize transaction fee overhead',
      'Resilience against corrupted GPS/telemetry packet spoofing'
    ],
    suggestedTech: ['Algorand PyTeal', 'Leaflet / Mapbox', 'WebSockets', 'React', 'Tailwind CSS', 'Python'],
    evaluationCriteria: 'Real-world practicality, smart contract state transitions, and interactive map UX.',
    isActive: true,
    order: 5,
    difficulty: 'Medium'
  },
  {
    psId: 'PS-06',
    title: 'Open Innovation: Autonomous AI Agents on Blockchain Rails',
    category: 'Open Innovation',
    shortDescription: 'Build novel multi-agent systems that autonomously execute micro-payments, negotiate services, or manage decentralized communities.',
    fullDescription: 'As autonomous AI agents evolve, they require native machine-to-machine financial infrastructure to trade resources, purchase API keys, and contract compute tasks. Algorand’s near-instant finality and minimal transaction fees ($0.001) provide the foundation for agent economies. Teams have open creative license to pioneer the future of AI x Web3.',
    expectedOutcome: 'An autonomous agent proof-of-concept demonstrating multi-agent negotiation, automated treasury management, predictive trading, or automated DAO governance execution.',
    requirements: [
      'Demonstration of at least 2 interacting autonomous agent instances',
      'On-chain transaction settlement on Algorand Testnet',
      'Interactive visual dashboard monitoring agent decisions, logs, and token balance changes',
      'Comprehensive architecture diagram and pitch deck'
    ],
    constraints: [
      'Must feature genuine autonomous decision loops, not scripted linear scripts',
      'Graceful error handling for agent fund limits'
    ],
    suggestedTech: ['LangGraph / AutoGen / CrewAI', 'Algorand Python SDK', 'FastAPI', 'React', 'Tailwind CSS'],
    evaluationCriteria: 'Originality, depth of AI-blockchain integration, and potential commercial impact.',
    isActive: true,
    order: 6,
    difficulty: 'Advanced'
  }
];

export const CATEGORIES = [
  'All',
  'Blockchain',
  'AI',
  'Cybersecurity',
  'FinTech',
  'Web3',
  'Open Innovation'
] as const;
