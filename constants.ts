import { Industry, OutreachCopy, AssetLink, ExceptionItem, ProspectStage } from './types';

export const AVERAGE_HOURLY_WAGE = 50; // $/hour, assumed for ROI calculations
export const VALUE_PER_DAY_PER_JOB = 0.50; // $/day/job, assumed value of cash flow improvement per day saved per job/invoice

export const INITIAL_OUTREACH_COPY: OutreachCopy[] = [
  {
    id: 'initial-logistics-email',
    industry: Industry.Logistics,
    type: 'Email',
    title: 'Cold Email: Logistics Efficiency',
    content: `Subject: Streamlining Your Logistics Operations

Hi [Prospect Name],

Hope this email finds you well.

At DFW Automation, we specialize in helping logistics companies like yours significantly reduce operational costs and accelerate workflow efficiency. We've seen clients achieve [X]% reduction in manual processing time.

Would you be open to a brief 15-minute call next week to explore how we can potentially automate [specific pain point]?

Best regards,
[Your Name]`,
    isCustom: false,
    stages: [ProspectStage.Lead, ProspectStage.Discovery],
  },
  {
    id: 'initial-construction-email',
    industry: Industry.Construction,
    type: 'Email',
    title: 'Cold Email: Construction Project Flow',
    content: `Subject: Accelerate Your Construction Project Workflows

Dear [Prospect Name],

Are manual administrative tasks slowing down your construction projects?

DFW Automation helps construction firms automate critical processes like invoice processing, material tracking, and job-to-payment cycles, leading to faster project completion and improved cash flow.

We'd love to show you how our automation solutions can deliver tangible ROI. Could we schedule a quick chat to discuss your specific needs?

Sincerely,
[Your Name]`,
    isCustom: false,
    stages: [ProspectStage.Lead, ProspectStage.Discovery],
  },
  {
    id: 'initial-dental-email',
    industry: Industry.Dental,
    type: 'Email',
    title: 'Cold Email: Dental Practice Automation',
    content: `Subject: Enhance Patient Experience & Practice Efficiency for [Dental Practice Name]

Hello [Prospect Name],

Managing a thriving dental practice means juggling patient care and administrative tasks. What if you could automate much of the latter?

DFW Automation provides tailored solutions for dental practices to streamline patient intake, billing, and appointment scheduling, freeing up your staff to focus on patient care.

Let's connect for 10 minutes to discuss how we can help your practice thrive.

Warmly,
[Your Name]`,
    isCustom: false,
    stages: [ProspectStage.Lead, ProspectStage.Discovery],
  },
  {
    id: 'initial-general-opener',
    industry: 'General',
    type: 'Call Opener',
    title: 'Cold Call Opener: General',
    content: `(Greeting) Hi [Prospect Name], this is [Your Name] from DFW Automation. We work with businesses like yours to automate time-consuming tasks and boost their bottom line. Did I catch you at an okay time for a quick 60-second introduction?`,
    isCustom: false,
    stages: [ProspectStage.Lead],
  },
  {
    id: 'initial-general-followup',
    industry: 'General',
    type: 'Follow-up Script',
    title: 'Follow-up Pilot Offer Script',
    content: `(After initial conversation/discovery) "Based on our discussion, I believe our pilot program is an ideal next step. For just $1,500, we'll implement a 30-day proof-of-concept for [specific automation area]. This allows you to see the direct impact on your operations and ROI before committing further. How does that sound?"`,
    isCustom: false,
    stages: [ProspectStage.Proposal, ProspectStage.Negotiation],
  },
];

export const INITIAL_ASSET_LINKS: AssetLink[] = [
  { id: '1', title: 'Google Cloud AI Solutions', url: 'https://cloud.google.com/ai', category: 'General Automation' },
  { id: '2', title: 'Construction Industry Trends 2024', url: 'https://example.com/construction-trends', category: 'Construction' },
  { id: '3', title: 'Logistics Automation Whitepaper', url: 'https://example.com/logistics-wp', category: 'Logistics' },
  { id: '4', title: 'Dental Practice Management Software Comparison', url: 'https://example.com/dental-software', category: 'Dental' },
  { id: '5', title: 'Latest in Accounting Automation', url: 'https://example.com/accounting-automation', category: 'Accounting' },
];

export const INITIAL_EXCEPTION_ITEMS: ExceptionItem[] = [
  { id: 'ex1', type: 'AP Issue', description: 'Invoice #12345 from Vendor X has missing PO number.', status: 'Open', date: new Date('2024-07-20T10:00:00Z') },
  { id: 'ex2', type: 'AR Issue', description: 'Client Y payment is 7 days overdue, amount $5,000.', status: 'Open', date: new Date('2024-07-18T14:30:00Z') },
  { id: 'ex3', type: 'Missed Job', description: 'Logistics delivery for Route Z was not completed.', status: 'Resolved', date: new Date('2024-07-15T08:00:00Z') },
  { id: 'ex4', type: 'Data Entry Error', description: 'Incorrect rate entered for Construction Project A.', status: 'Open', date: new Date('2024-07-21T11:45:00Z') },
];

export const DEMO_ROI_DATA = {
  [Industry.Construction]: {
    monthlyJobsInvoices: 150,
    manualCostPerTask: 25,
    autoCostPerTask: 5,
    hoursSavedPerMonth: 80,
    setupFee: 15000,
    avgDaysJobToInvoice: 10, // Added demo data
    avgDaysInvoiceToPayment: 30, // Added demo data
    automatedDaysReduction: 10, // Added demo data (e.g., reduces total cycle by 10 days)
  },
  [Industry.Logistics]: {
    monthlyJobsInvoices: 500,
    manualCostPerTask: 10,
    autoCostPerTask: 2,
    hoursSavedPerMonth: 120,
    setupFee: 20000,
    avgDaysJobToInvoice: 7, // Added demo data
    avgDaysInvoiceToPayment: 25, // Added demo data
    automatedDaysReduction: 8, // Added demo data
  },
  [Industry.FieldServices]: {
    monthlyJobsInvoices: 200,
    manualCostPerTask: 18,
    autoCostPerTask: 4,
    hoursSavedPerMonth: 60,
    setupFee: 12000,
    avgDaysJobToInvoice: 12, // Added demo data
    avgDaysInvoiceToPayment: 35, // Added demo data
    automatedDaysReduction: 15, // Added demo data
  },
  [Industry.Dental]: {
    monthlyJobsInvoices: 800,
    manualCostPerTask: 5,
    autoCostPerTask: 1,
    hoursSavedPerMonth: 40,
    setupFee: 8000,
    avgDaysJobToInvoice: 5, // Added demo data
    avgDaysInvoiceToPayment: 15, // Added demo data
    automatedDaysReduction: 5, // Added demo data
  },
  [Industry.Accounting]: {
    monthlyJobsInvoices: 300,
    manualCostPerTask: 30,
    autoCostPerTask: 6,
    hoursSavedPerMonth: 100,
    setupFee: 18000,
    avgDaysJobToInvoice: 15, // Added demo data
    avgDaysInvoiceToPayment: 40, // Added demo data
    automatedDaysReduction: 20, // Added demo data
  },
};