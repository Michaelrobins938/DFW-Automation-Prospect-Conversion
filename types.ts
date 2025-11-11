export enum Industry {
  Construction = 'Construction',
  Logistics = 'Logistics',
  FieldServices = 'Field Services',
  Dental = 'Dental',
  Accounting = 'Accounting',
}

export enum ProspectStage {
  Lead = 'Lead',
  Discovery = 'Discovery',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  ClosedWon = 'Closed Won',
  ClosedLost = 'Closed Lost',
}

export interface RoiDashboardData {
  industry: Industry;
  monthlyJobsInvoices: number;
  manualCostPerTask: number;
  autoCostPerTask: number;
  hoursSavedPerMonth: number;
  setupFee: number;
  // New fields for cash flow improvement
  avgDaysJobToInvoice: number;
  avgDaysInvoiceToPayment: number;
  automatedDaysReduction: number; // Total days automation is projected to save in the payment cycle
  // Calculated outputs
  monthlySavings: number;
  paybackMonths: number;
  monthlyManualCost: number;
  monthlyAutoCost: number;
  cashFlowImprovementSavings: number; // Monetary value of improved cash flow
}

export interface OutreachCopy {
  id: string; // Added for unique identification of templates
  industry: Industry | 'General';
  type: 'Email' | 'Call Opener' | 'Follow-up Script';
  title: string;
  content: string;
  isCustom: boolean; // Indicates if the template is user-created
  stages?: ProspectStage[]; // Optional array of prospect stages
}

export interface IntakeFormData {
  id: string;
  monthlyJobsInvoices: number;
  avgDaysJobToInvoice: number;
  avgDaysInvoiceToPayment: number;
  staffAdminTimeMonthly: number; // hours
  mainSoftwareTechStack: string;
  decisionMakerThreshold: number;
  submissionDate: Date;
}

export interface AssetLink {
  id: string;
  title: string;
  url: string;
  category: string;
}

export interface ExceptionItem {
  id: string;
  type: string;
  description: string;
  status: 'Open' | 'Resolved';
  date: Date;
}