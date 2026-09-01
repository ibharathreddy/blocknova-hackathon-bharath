import { ProblemStatement } from '../types';

export const PROBLEM_STATEMENTS: ProblemStatement[] = [
  // -------------------------------------------------------------
  // Standard Entry Projects
  // -------------------------------------------------------------
  {
    psId: 'SEP-01',
    title: 'Cold Email Personalizer',
    category: 'Standard Entry Projects',
    trackType: 'Standard',
    shortDescription: 'Create an AI-powered service that generates personalized outreach emails from structured lead info with pay-per-use x402 Algorand micropayments.',
    fullDescription: 'Create an AI-powered service that generates personalized outreach emails from structured lead information such as company details, job roles, and customer profiles. Each email generation request is processed through an x402-powered API, enabling pay-per-use access via Algorand micropayments.',
    expectedOutcome: 'A fully functional email generation API and web dashboard integrated with the x402 monetization protocol. The client sends structured lead payloads, the API handles pay-per-call Algorand micropayments, and outputs compelling, personalized email copy.',
    requirements: [
      'AI prompt engineering & LLM integration (Gemini / OpenAI / Claude) for tailored lead messaging',
      'x402-compliant API endpoint processing pay-per-use requests',
      'Algorand Testnet wallet integration for automated micropayment transfers',
      'Interactive web interface for bulk or single lead input with live generation preview'
    ],
    constraints: [
      'Email generation response time must be under 8 seconds per lead',
      'Must verify x402 payment header on Algorand before fulfilling email generation request',
      'Clean handling of invalid lead schemas with informative error messages'
    ],
    suggestedTech: ['Algorand SDK / AlgoKit', 'x402 Protocol', 'FastAPI / Node.js', 'React / TypeScript', 'Tailwind CSS', 'Gemini / OpenAI API'],
    evaluationCriteria: 'Copywriting quality & relevance, seamlessness of the x402 payment handshake, UI experience, and code architecture.',
    isActive: true,
    isReleased: true,
    order: 1,
    difficulty: 'Medium',
    maxTeams: 5
  },
  {
    psId: 'SEP-02',
    title: 'Meme Caption Engine',
    category: 'Standard Entry Projects',
    trackType: 'Standard',
    shortDescription: 'Build an AI service that generates creative meme captions in multiple humorous styles monetized via x402 Algorand micropayments.',
    fullDescription: 'Build an AI service that generates creative meme captions in multiple humorous styles, including sarcastic, witty, wholesome, and Gen Z humor. Content creators can pay only for the captions they generate using x402 micropayments.',
    expectedOutcome: 'A dynamic meme caption generator where creators select or upload meme templates, choose humor styles (sarcastic, witty, wholesome, Gen Z), and pay only for the generated captions via x402 on Algorand.',
    requirements: [
      'Multi-tone humor generation engine supporting sarcastic, witty, wholesome, and Gen Z humor',
      'x402 paywall middleware requesting micropayment per generation batch',
      'Algorand wallet support (Pera / Defly) for instant transaction authorization',
      'Image meme previewer with automatic text overlay and download/export capabilities'
    ],
    constraints: [
      'Caption generation latency under 5 seconds',
      'Micropayment cost must reflect pay-per-use model accurately on Algorand',
      'Content safety filter to prevent harmful or hate speech'
    ],
    suggestedTech: ['Algorand Python/JS SDK', 'x402 Protocol', 'React', 'HTML5 Canvas', 'Python / Express', 'OpenAI / Gemini API'],
    evaluationCriteria: 'Humor variety & punchiness, speed of caption generation, smooth x402 payment verification, and visual meme creator UX.',
    isActive: true,
    isReleased: true,
    order: 2,
    difficulty: 'Easy',
    maxTeams: 5
  },
  {
    psId: 'SEP-03',
    title: 'Meeting Notes to Action Items',
    category: 'Standard Entry Projects',
    trackType: 'Standard',
    shortDescription: 'Develop an AI-powered application that converts meeting transcripts into structured action items monetized through x402.',
    fullDescription: 'Develop an AI-powered application that converts meeting transcripts into structured action items by automatically identifying tasks, owners, deadlines, and priorities. Every transcript processing request is monetized through x402.',
    expectedOutcome: 'An intelligent transcript analyzer that converts raw meeting recordings or transcripts into an organized action plan with owners, milestones, priority tags, and calendar exports, charging users per transcript via x402 micropayments.',
    requirements: [
      'Natural Language Processing pipeline extracting tasks, assignee names, deadlines, and priority rankings',
      'x402 payment verification protecting the transcript extraction API endpoint',
      'Algorand on-chain settlement for pay-per-transcript processing',
      'Interactive dashboard to edit, organize, assign, and export action items (CSV, JSON, Trello/Jira schema)'
    ],
    constraints: [
      'Support transcripts up to 10,000 words without timeout errors',
      'Zero loss of context for multi-speaker conversations',
      'Instant authorization upon valid Algorand x402 payment'
    ],
    suggestedTech: ['Algorand SDK', 'x402 Protocol', 'LangChain / LlamaIndex', 'React', 'TypeScript', 'Tailwind CSS'],
    evaluationCriteria: 'Entity extraction accuracy (who does what by when), x402 payment flow integration, and usability of the action item manager.',
    isActive: true,
    isReleased: true,
    order: 3,
    difficulty: 'Medium',
    maxTeams: 5
  },

  // -------------------------------------------------------------
  // Composite Entry Projects
  // -------------------------------------------------------------
  {
    psId: 'CEP-01',
    title: 'Payment Logging & Audit Infrastructure',
    category: 'Composite Entry Projects',
    trackType: 'Composite',
    shortDescription: 'Build an infrastructure service that creates immutable audit trails linking API responses with x402 payments and Algorand receipts.',
    fullDescription: 'Build an infrastructure service that creates immutable audit trails linking every API response with its blockchain transaction receipt with its corresponding x402 payment and Algorand blockchain transaction receipt. The platform should provide transparent logging, compliance support, and debugging capabilities for developers and enterprises.',
    expectedOutcome: 'An enterprise-ready audit logging platform providing cryptographic proof of API delivery tied to Algorand payment transactions, complete with an intuitive analytics and compliance explorer dashboard.',
    requirements: [
      'Reverse proxy or logging agent that captures API requests, responses, and x402 headers',
      'Algorand transaction verifier indexing on-chain receipts against internal request IDs',
      'Immutable audit trail storage and cryptographic proof generation (Merkle tree / hashing)',
      'Enterprise admin portal for querying audit logs, filtering transaction receipts, and compliance exports'
    ],
    constraints: [
      'Sub-millisecond logging overhead added to upstream API requests',
      'Resilient storage guaranteeing zero audit log drop during high throughput',
      'Tamper-evident verification of logs against Algorand blockchain state'
    ],
    suggestedTech: ['Algorand Indexer SDK', 'x402 Protocol', 'Go / Node.js / Python', 'TimescaleDB / PostgreSQL', 'React', 'Tailwind CSS'],
    evaluationCriteria: 'Architecture scalability, audit trail cryptographic integrity, low-latency performance, and enterprise explorer UX.',
    isActive: true,
    isReleased: true,
    order: 4,
    difficulty: 'Hard',
    maxTeams: 5
  },
  {
    psId: 'CEP-02',
    title: 'x402 Payment Gateway',
    category: 'Composite Entry Projects',
    trackType: 'Composite',
    shortDescription: 'Develop a reusable payment gateway that enables multiple applications to monetize APIs through x402 with route-based pricing.',
    fullDescription: 'Develop a reusable payment gateway that enables multiple applications to monetize APIs through x402. The gateway should support route-based pricing, merchant wallet management, payment validation, analytics, and seamless integration with both Web2 and Web3 applications.',
    expectedOutcome: 'A modular, developer-friendly payment gateway middleware and merchant portal allowing API providers to define route pricing (e.g. 0.05 ALGO / route), manage merchant payout wallets, validate transactions, and view real-time revenue analytics.',
    requirements: [
      'Configurable proxy gateway intercepting HTTP requests with dynamic 402 Payment Required responses',
      'Merchant management console for setting route prices, API keys, and Algorand payout addresses',
      'Automated transaction validation and confirmation on Algorand Testnet',
      'Analytics dashboard tracking revenue, volume, top routes, and latency'
    ],
    constraints: [
      'Seamless drop-in compatibility for standard REST / GraphQL endpoints',
      'Robust replay attack prevention and double-spend protection',
      'Sub-2-second verification and authorization cycle'
    ],
    suggestedTech: ['Algorand JavaScript / Python SDK', 'x402 Middleware', 'Express / FastAPI / Next.js', 'Redis', 'Chart.js', 'React'],
    evaluationCriteria: 'Ease of developer integration, gateway security & replay defense, flexibility of pricing models, and merchant analytics UX.',
    isActive: true,
    isReleased: true,
    order: 5,
    difficulty: 'Advanced',
    maxTeams: 5
  },
  {
    psId: 'CEP-03',
    title: 'Receipt Verification Service',
    category: 'Composite Entry Projects',
    trackType: 'Composite',
    shortDescription: 'Create a verification service that exposes APIs for validating x402 payment receipts and confirming settlement on Algorand.',
    fullDescription: 'Create a verification service that exposes APIs for validating x402 payment receipts and confirming settlement status on the Algorand blockchain. The service should help applications securely verify completed transactions, prevent fraudulent access, and automate service authorization based on successful payments.',
    expectedOutcome: 'A high-throughput verification microservice providing REST & WebSocket endpoints for instantaneous confirmation of x402 payment receipts against Algorand blockchain state, preventing replay attacks and authorizing downstream services.',
    requirements: [
      'High-speed receipt validation engine checking signature, sender, recipient, timestamp, and amount on Algorand',
      'Anti-fraud and replay mitigation caching used transaction IDs and nonces',
      'Developer SDK / Client library for 1-line integration into external backend stacks',
      'Public verification widget / explorer for end-users to check payment receipt validity'
    ],
    constraints: [
      'Receipt verification API latency under 500ms',
      'Strict handling of unconfirmed vs confirmed Algorand transaction states',
      'Rate-limiting and DDoS resilience for validation endpoints'
    ],
    suggestedTech: ['Algorand SDK & Indexer', 'x402 Protocol', 'TypeScript / Rust / Python', 'Redis / SQLite', 'React', 'Tailwind CSS'],
    evaluationCriteria: 'Verification correctness, speed & throughput benchmarks, SDK elegance, and fraud defense mechanisms.',
    isActive: true,
    isReleased: true,
    order: 6,
    difficulty: 'Hard',
    maxTeams: 5
  }
];

export const CATEGORIES = [
  'All',
  'Standard Entry Projects',
  'Composite Entry Projects'
] as const;
