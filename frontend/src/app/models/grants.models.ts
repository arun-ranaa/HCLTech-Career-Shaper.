export interface User {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  organizationName?: string;
}

export interface Criterion {
  criterionId?: number;
  criterionCode: string;
  criterionName: string;
  criterionType: string;
  expectedValue: string;
  isMandatory: string;
  weightage: number;
}

export interface GrantProgram {
  programId?: number;
  programCode: string;
  title: string;
  category: string;
  fundingAgency: string;
  description: string;
  totalBudget: number;
  disbursedBudget: number;
  minGrantAmount: number;
  maxGrantAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  eligibilitySummary?: string;
  criteria?: Criterion[];
}

export interface Application {
  applicationId?: number;
  applicationNumber: string;
  program?: GrantProgram;
  applicant?: User;
  projectTitle: string;
  projectSummary: string;
  requestedAmount: number;
  approvedAmount?: number;
  projectDurationMonths: number;
  targetBeneficiaries?: string;
  stateOrRegion: string;
  district: string;
  organizationType: string;
  organizationPan: string;
  organizationGstin?: string;
  annualTurnover: number;
  yearsInOperation: number;
  eligibilityStatus: string;
  eligibilityRemarks?: string;
  submissionDate: string;
  status: string;
}

export interface ApplicationReview {
  reviewId?: number;
  reviewer?: User;
  feasibilityScore: number;
  innovationScore: number;
  budgetRealismScore: number;
  socialImpactScore: number;
  totalScore: number;
  recommendation: string;
  reviewComments?: string;
  reviewDate?: string;
  status: string;
}

export interface ApprovalWorkflowLog {
  logId?: number;
  actionBy?: User;
  previousStatus: string;
  newStatus: string;
  actionTaken: string;
  decisionNotes?: string;
  actionTimestamp: string;
}

export interface GrantDisbursement {
  disbursementId?: number;
  application?: Application;
  trancheNumber: number;
  disbursementReference: string;
  disbursementAmount: number;
  paymentMethod: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  transactionReference?: string;
  scheduledDate: string;
  disbursementDate?: string;
  status: string;
  remarks?: string;
}

export interface UtilizationReport {
  reportId?: number;
  application?: Application;
  trancheNumber: number;
  milestoneTitle: string;
  amountUtilized: number;
  utilizationPercentage: number;
  progressNarrative: string;
  submissionDate?: string;
  verificationStatus: string;
  verificationRemarks?: string;
}

export interface DashboardStats {
  totalPrograms: number;
  activePrograms: number;
  totalAllocatedBudget: number;
  totalDisbursedBudget: number;
  totalApplications: number;
  applicationsApproved: number;
  applicationsUnderReview: number;
  applicationsDisbursed: number;
  applicationsRejected: number;
  budgetUtilizationRate: number;
}
