/**
 * Grants Management System (J18) - Multi-Portal Role-Based Architecture
 * Implements strict Authentication & Role-Based Access Control (RBAC):
 *  1. ROLE_APPLICANT       -> Citizen / Enterprise / NGO Portal
 *  2. ROLE_PROGRAM_OFFICER -> Ministry Officer Scheme & Sanction Desk
 *  3. ROLE_REVIEWER        -> Evaluation Committee Rubric Scoring Portal
 *  4. ROLE_ADMIN           -> System Administrator & Audit Console
 */

const API_BASE = 'http://localhost:8080/api/v1';

// Seed User Profiles for Authentication & Authorization
const USERS_DB = {
  'applicant_patel': {
    userId: 7,
    username: 'applicant_patel',
    fullName: 'Chirag Patel',
    role: 'ROLE_APPLICANT',
    organizationName: 'KrishiAI Technologies Pvt Ltd (DPIIT Startup)',
    email: 'chirag@krishiai-tech.com',
    location: 'Surat, Gujarat'
  },
  'officer_sharma': {
    userId: 2,
    username: 'officer_sharma',
    fullName: 'Sunita Sharma',
    role: 'ROLE_PROGRAM_OFFICER',
    organizationName: 'Department of Science and Technology (DST)',
    email: 'sunita.sharma@dst.gov.in',
    location: 'New Delhi'
  },
  'reviewer_kapoor': {
    userId: 4,
    username: 'reviewer_kapoor',
    fullName: 'Dr. Alok Kapoor',
    role: 'ROLE_REVIEWER',
    organizationName: 'IIT Delhi - Dept of Electrical Engg',
    email: 'alok.kapoor@iitd.ac.in',
    location: 'New Delhi'
  },
  'admin': {
    userId: 1,
    username: 'admin',
    fullName: 'Rajesh K. Verma',
    role: 'ROLE_ADMIN',
    organizationName: 'Ministry of Finance / National Informatics Centre',
    email: 'admin.grants@gov.in',
    location: 'New Delhi'
  }
};

// Application State
const state = {
  currentUser: null, // Null indicates unauthenticated (Login Screen)
  authMode: 'login', // 'login' or 'register'
  currentTab: 'default',
  stats: null,
  programs: [],
  applications: [],
  disbursements: [],
  utilizationReports: [],
  auditLogs: [],
  selectedProgramId: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  const saved = localStorage.getItem('gms_session_user');
  if (saved) {
    try {
      state.currentUser = JSON.parse(saved);
      setDefaultTabForRole(state.currentUser.role);
    } catch (e) {
      state.currentUser = null;
    }
  }

  await loadData();
  loadStateFromStorage();
  renderApp();
});

function setDefaultTabForRole(role) {
  if (role === 'ROLE_APPLICANT') state.currentTab = 'applicant_schemes';
  else if (role === 'ROLE_PROGRAM_OFFICER') state.currentTab = 'officer_overview';
  else if (role === 'ROLE_REVIEWER') state.currentTab = 'reviewer_queue';
  else if (role === 'ROLE_ADMIN') state.currentTab = 'admin_overview';
  else state.currentTab = 'login';
}


// =============================================================================
// PERSISTENT STORAGE HELPERS (Local Session Synchronization Across Roles)
// =============================================================================
function saveStateToStorage() {
  try {
    const payload = {
      applications: state.applications,
      auditLogs: state.auditLogs,
      disbursements: state.disbursements,
      programs: state.programs,
      utilizationReports: state.utilizationReports,
      stats: state.stats
    };
    localStorage.setItem('gms_app_state_v3', JSON.stringify(payload));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

function loadStateFromStorage() {
  try {
    const saved = localStorage.getItem('gms_app_state_v3');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.applications && p.applications.length > 0) state.applications = p.applications;
      if (p.auditLogs && p.auditLogs.length > 0) state.auditLogs = p.auditLogs;
      if (p.disbursements && p.disbursements.length > 0) state.disbursements = p.disbursements;
      if (p.programs && p.programs.length > 0) state.programs = p.programs;
      if (p.utilizationReports && p.utilizationReports.length > 0) state.utilizationReports = p.utilizationReports;
      if (p.stats) state.stats = p.stats;
      return true;
    }
  } catch (e) {
    console.warn('Storage load failed:', e);
  }
  return false;
}

// Data Loader (Backend with Fallback Mock)
async function loadData() {
  try {
    const [statsRes, progsRes, appsRes, disbRes, utilRes] = await Promise.all([
      fetch(`${API_BASE}/analytics/dashboard`).catch(() => null),
      fetch(`${API_BASE}/programs`).catch(() => null),
      fetch(`${API_BASE}/applications`).catch(() => null),
      fetch(`${API_BASE}/disbursements`).catch(() => null),
      fetch(`${API_BASE}/utilization-reports`).catch(() => null)
    ]);

    if (statsRes && statsRes.ok) state.stats = await statsRes.json();
    if (progsRes && progsRes.ok) state.programs = await progsRes.json();
    if (appsRes && appsRes.ok) state.applications = await appsRes.json();
    if (disbRes && disbRes.ok) state.disbursements = await disbRes.json();
    if (utilRes && utilRes.ok) state.utilizationReports = await utilRes.json();
  } catch (e) {}

  if (!state.stats) {
    state.stats = {
      totalPrograms: 4,
      activePrograms: 4,
      totalAllocatedBudget: 280000000,
      totalDisbursedBudget: 90500000,
      totalApplications: 5,
      applicationsApproved: 2,
      applicationsUnderReview: 1,
      applicationsDisbursed: 2,
      applicationsRejected: 0,
      budgetUtilizationRate: 32.32
    };
  }

  if (!state.programs || state.programs.length === 0) {
    state.programs = [
      {
        programId: 1,
        programCode: 'GMS-2024-AGRI-01',
        title: 'PM Matsya Sampada Aquaculture Tech Grant',
        category: 'Agriculture & Fisheries',
        fundingAgency: 'Ministry of Fisheries, Animal Husbandry & Dairying',
        totalBudget: 50000000,
        disbursedBudget: 14500000,
        minGrantAmount: 1000000,
        maxGrantAmount: 7500000,
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        status: 'ACTIVE',
        eligibilitySummary: 'MSMEs or Startups registered in India with min 2 years operational record in fisheries.',
        criteria: [
          { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '2', isMandatory: 'Y', weightage: 30 },
          { criterionCode: 'ENTITY_TYPE_ALLOWED', criterionName: 'Entity Type Allowed', criterionType: 'IN_LIST', expectedValue: 'Startup,MSME,LLP', isMandatory: 'Y', weightage: 35 },
          { criterionCode: 'GST_REGISTRATION', criterionName: 'Valid GSTIN', criterionType: 'BOOLEAN', expectedValue: 'TRUE', isMandatory: 'Y', weightage: 35 }
        ]
      },
      {
        programId: 2,
        programCode: 'GMS-2024-CLEAN-02',
        title: 'National Clean Energy Solar Innovation Grant',
        category: 'Clean Energy',
        fundingAgency: 'Ministry of New and Renewable Energy',
        totalBudget: 120000000,
        disbursedBudget: 42000000,
        minGrantAmount: 2500000,
        maxGrantAmount: 20000000,
        startDate: '2024-05-15',
        endDate: '2025-11-30',
        status: 'ACTIVE',
        eligibilitySummary: 'Indian Private Limited companies or Academic Labs. Min turnover INR 50 Lakhs.',
        criteria: [
          { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '3', isMandatory: 'Y', weightage: 30 },
          { criterionCode: 'MIN_TURNOVER_LAKHS', criterionName: 'Min Annual Turnover (Lakhs)', criterionType: 'NUMERIC_MIN', expectedValue: '50', isMandatory: 'Y', weightage: 40 }
        ]
      },
      {
        programId: 3,
        programCode: 'GMS-2024-TECH-03',
        title: 'Digital India AI & Cybersecurity Challenge Grant',
        category: 'Technology & Innovation',
        fundingAgency: 'Ministry of Electronics and Information Technology (MeitY)',
        totalBudget: 85000000,
        disbursedBudget: 28000000,
        minGrantAmount: 5000000,
        maxGrantAmount: 15000000,
        startDate: '2024-06-01',
        endDate: '2025-12-31',
        status: 'ACTIVE',
        eligibilitySummary: 'DPIIT recognized Startups with Indian resident majority shareholding and functional prototype.',
        criteria: [
          { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '1', isMandatory: 'Y', weightage: 40 },
          { criterionCode: 'ENTITY_TYPE_ALLOWED', criterionName: 'Permissible Entities', criterionType: 'IN_LIST', expectedValue: 'Startup,MSME', isMandatory: 'Y', weightage: 60 }
        ]
      },
      {
        programId: 4,
        programCode: 'GMS-2024-WOMEN-05',
        title: 'Rural Women Artisan Digital Livelihood Grant',
        category: 'Women Entrepreneurship',
        fundingAgency: 'Ministry of Rural Development',
        totalBudget: 25000000,
        disbursedBudget: 6000000,
        minGrantAmount: 500000,
        maxGrantAmount: 3000000,
        startDate: '2024-02-15',
        endDate: '2025-06-30',
        status: 'ACTIVE',
        eligibilitySummary: 'Cooperative societies or registered NGOs with at least 70% women members.',
        criteria: [
          { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '2', isMandatory: 'Y', weightage: 50 }
        ]
      }
    ];
  }

  if (!state.applications || state.applications.length === 0) {
    state.applications = [
      {
        applicationId: 1,
        applicationNumber: 'APP-2024-AGRI-00101',
        program: state.programs[0],
        applicant: USERS_DB['applicant_patel'],
        projectTitle: 'Smart IoT AquaAerator for Freshwater Prawns',
        projectSummary: 'Deployment of solar-assisted automatic oxygenators with pH and turbidity monitoring in coastal aquaculture ponds.',
        requestedAmount: 4500000,
        approvedAmount: 4200000,
        projectDurationMonths: 18,
        stateOrRegion: 'Gujarat',
        district: 'Surat',
        organizationType: 'Startup',
        organizationPan: 'AAACK1234F',
        organizationGstin: '24AAACK1234F1Z8',
        annualTurnover: 12000000,
        yearsInOperation: 3,
        eligibilityStatus: 'AUTO_ELIGIBLE',
        eligibilityRemarks: 'All mandatory criteria satisfied: 3 yrs active, valid GST.',
        status: 'APPROVED',
        submissionDate: '2024-04-12 10:30',
        assignedReviewer: USERS_DB['reviewer_kapoor'],
        reviewScores: { feasibility: 23, innovation: 21, budget: 22, social: 24, total: 90, recommendation: 'RECOMMEND_APPROVE' }
      },
      {
        applicationId: 2,
        applicationNumber: 'APP-2024-CLEAN-00201',
        program: state.programs[1],
        applicant: { userId: 8, fullName: 'Kavitha Reddy', organizationName: 'Surya Shakti Solar NGO', role: 'ROLE_APPLICANT' },
        projectTitle: 'Community Solar Microgrid with Flow Batteries',
        projectSummary: 'Deploying 50kW agro-photovoltaic micro-grids powering irrigation pumps and rural micro-cold storages.',
        requestedAmount: 15000000,
        approvedAmount: 14000000,
        projectDurationMonths: 24,
        stateOrRegion: 'Telangana',
        district: 'Warangal',
        organizationType: 'NGO / Trust',
        organizationPan: 'AAATG9988D',
        organizationGstin: '36AAATG9988D1ZC',
        annualTurnover: 6500000,
        yearsInOperation: 5,
        eligibilityStatus: 'AUTO_ELIGIBLE',
        eligibilityRemarks: 'Turnover and experience criteria verified.',
        status: 'APPROVED',
        submissionDate: '2024-05-25 11:00',
        assignedReviewer: USERS_DB['reviewer_kapoor'],
        reviewScores: { feasibility: 24, innovation: 22, budget: 23, social: 25, total: 94, recommendation: 'RECOMMEND_APPROVE' }
      },
      {
        applicationId: 3,
        applicationNumber: 'APP-2024-TECH-00301',
        program: state.programs[2],
        applicant: USERS_DB['applicant_patel'],
        projectTitle: 'BhashaAI: Multilingual Speech-to-Speech Engine for Rural Health',
        projectSummary: 'Speech recognition and translation for 10 Indic languages enabling ASHA health workers to capture patient notes.',
        requestedAmount: 12000000,
        approvedAmount: 11000000,
        projectDurationMonths: 18,
        stateOrRegion: 'Karnataka',
        district: 'Bengaluru Urban',
        organizationType: 'Startup',
        organizationPan: 'AAACK1234F',
        organizationGstin: '29AAACK1234F1Z1',
        annualTurnover: 14000000,
        yearsInOperation: 3,
        eligibilityStatus: 'AUTO_ELIGIBLE',
        eligibilityRemarks: 'Full eligibility confirmed.',
        status: 'DISBURSED',
        submissionDate: '2024-06-15 09:20',
        assignedReviewer: USERS_DB['reviewer_kapoor'],
        reviewScores: { feasibility: 25, innovation: 25, budget: 22, social: 24, total: 96, recommendation: 'RECOMMEND_APPROVE' }
      },
      {
        applicationId: 4,
        applicationNumber: 'APP-2024-AGRI-00102',
        program: state.programs[0],
        applicant: { userId: 9, fullName: 'Harpreet Singh', organizationName: 'Green Harvest Hydroponics LLP', role: 'ROLE_APPLICANT' },
        projectTitle: 'Cold-Water Trout Recirculatory Aquaculture System (RAS)',
        projectSummary: 'Indoor recirculatory tank systems for high-altitude trout cultivation in Mandi district.',
        requestedAmount: 6000000,
        approvedAmount: null,
        projectDurationMonths: 24,
        stateOrRegion: 'Himachal Pradesh',
        district: 'Mandi',
        organizationType: 'MSME',
        organizationPan: 'AABCG5543K',
        organizationGstin: '02AABCG5543K1Z2',
        annualTurnover: 8500000,
        yearsInOperation: 4,
        eligibilityStatus: 'AUTO_ELIGIBLE',
        eligibilityRemarks: 'Meets operational age, registered MSME.',
        status: 'UNDER_REVIEW',
        submissionDate: '2024-04-20 14:15',
        assignedReviewer: USERS_DB['reviewer_kapoor'],
        reviewScores: null
      }
    ];
  }

  if (!state.disbursements || state.disbursements.length === 0) {
    state.disbursements = [
      {
        disbursementId: 1,
        application: state.applications[0],
        trancheNumber: 1,
        disbursementReference: 'PFMS-TR-2024-00101',
        disbursementAmount: 2500000,
        paymentMethod: 'PFMS_NEFT',
        bankName: 'State Bank of India',
        accountNumberMasked: 'XXXXXX1234',
        ifscCode: 'SBIN0001234',
        transactionReference: 'PFMS20240505129844',
        scheduledDate: '2024-05-05',
        disbursementDate: '2024-05-05',
        status: 'DISBURSED',
        remarks: 'Tranche 1 released upon MoU execution.'
      },
      {
        disbursementId: 2,
        application: state.applications[0],
        trancheNumber: 2,
        disbursementReference: 'PFMS-TR-2024-00102',
        disbursementAmount: 1700000,
        paymentMethod: 'PFMS_NEFT',
        bankName: 'State Bank of India',
        accountNumberMasked: 'XXXXXX1234',
        ifscCode: 'SBIN0001234',
        scheduledDate: '2024-11-15',
        status: 'SCHEDULED',
        remarks: 'Tranche 2 scheduled upon UC verification.'
      },
      {
        disbursementId: 3,
        application: state.applications[2],
        trancheNumber: 1,
        disbursementReference: 'PFMS-TR-2024-00501',
        disbursementAmount: 6000000,
        paymentMethod: 'PFMS_NEFT',
        bankName: 'HDFC Bank Ltd',
        accountNumberMasked: 'XXXXXX9876',
        ifscCode: 'HDFC0000543',
        transactionReference: 'PFMS20240710998811',
        scheduledDate: '2024-07-10',
        disbursementDate: '2024-07-10',
        status: 'DISBURSED',
        remarks: 'Tranche 1 for GPU computing cluster compute.'
      }
    ];
  }

  if (!state.utilizationReports || state.utilizationReports.length === 0) {
    state.utilizationReports = [
      {
        reportId: 1,
        application: state.applications[0],
        trancheNumber: 1,
        milestoneTitle: 'Procurement and Pond Installation of 40 Solar Aerators',
        amountUtilized: 2450000,
        utilizationPercentage: 98.0,
        progressNarrative: 'Procured 40 aerator assemblies with brushless motors, solar arrays, and IoT dissolved oxygen sensors.',
        verificationStatus: 'VERIFIED_SATISFACTORY',
        verificationRemarks: 'Site inspection completed by district fisheries officer.'
      },
      {
        reportId: 2,
        application: state.applications[2],
        trancheNumber: 1,
        milestoneTitle: 'Indic Acoustic Dataset Collection (10 Languages)',
        amountUtilized: 5850000,
        utilizationPercentage: 97.5,
        progressNarrative: 'Recorded 4,200 hours of conversational health dialogues in Hindi, Tamil, Telugu, and Gujarati.',
        verificationStatus: 'VERIFIED_SATISFACTORY',
        verificationRemarks: 'Dataset audit verified.'
      }
    ];
  }

  if (!state.auditLogs || state.auditLogs.length === 0) {
    state.auditLogs = [
      { timestamp: '2024-04-12 10:30', user: 'Chirag Patel (Applicant)', action: 'SUBMIT', entity: 'APP-2024-AGRI-00101', ip: '49.36.12.98', details: 'Submitted proposal with 4 uploaded verified documents.' },
      { timestamp: '2024-04-15 11:00', user: 'Sunita Sharma (Officer)', action: 'ASSIGN_REVIEWER', entity: 'APP-2024-AGRI-00101', ip: '10.20.1.45', details: 'Assigned proposal to Dr. Alok Kapoor (IIT Delhi).' },
      { timestamp: '2024-04-28 11:30', user: 'Dr. Alok Kapoor (Reviewer)', action: 'SUBMIT_REVIEW', entity: 'APP-2024-AGRI-00101', ip: '14.139.45.10', details: 'Score: 90/100 | Recommendation: RECOMMEND_APPROVE.' },
      { timestamp: '2024-05-02 15:00', user: 'Sunita Sharma (Officer)', action: 'APPROVE', entity: 'APP-2024-AGRI-00101', ip: '10.20.1.45', details: 'Sanction approved for INR 42,00,000 in two tranches.' },
      { timestamp: '2024-05-05 12:45', user: 'Sunita Sharma (Officer)', action: 'DISBURSE', entity: 'PFMS-TR-2024-00101', ip: '10.20.1.45', details: 'Released Tranche 1 payment of INR 25,00,000 via PFMS NEFT.' }
    ];
  }
}

function formatINR(val) {
  if (val === null || val === undefined) return 'INR 0';
  return 'INR ' + Number(val).toLocaleString('en-IN');
}

function getStatusBadge(status) {
  const map = {
    'ACTIVE': 'badge-green',
    'APPROVED': 'badge-green',
    'DISBURSED': 'badge-green',
    'AUTO_ELIGIBLE': 'badge-green',
    'VERIFIED_SATISFACTORY': 'badge-green',
    'RECOMMEND_APPROVE': 'badge-green',
    'SUBMITTED': 'badge-blue',
    'UNDER_REVIEW': 'badge-yellow',
    'PENDING_VERIFICATION': 'badge-yellow',
    'SCHEDULED': 'badge-blue',
    'DRAFT': 'badge-gray',
    'CLOSED': 'badge-gray',
    'AUTO_INELIGIBLE': 'badge-red',
    'REJECTED': 'badge-red',
    'RECOMMEND_REJECT': 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// =============================================================================
// MAIN APP RENDERER
// =============================================================================
function renderApp() {
  const root = document.getElementById('app');

  // If not logged in -> Show Authentication Gate
  if (!state.currentUser) {
    renderLoginScreen(root);
    return;
  }

  // If logged in -> Render Role-Specific Portal
  root.innerHTML = `
    <!-- Top Bar with User Info & Logout -->
    <header class="gov-topbar">
      <div class="gov-logo-section">
        <div class="gov-emblem">GOI</div>
        <div class="gov-title">
          <h1>Grants Management System (GMS - J18)</h1>
          <p>${getPortalTitleByRole(state.currentUser.role)}</p>
        </div>
      </div>
      <div class="user-role-badge">
        <div style="text-align: right; line-height: 1.2;">
          <div style="font-weight: 600;">${state.currentUser.fullName}</div>
          <small style="color: #bfdbfe; font-size: 11px;">${state.currentUser.organizationName}</small>
        </div>
        <span class="role-tag">${getRoleBadgeName(state.currentUser.role)}</span>
        <button class="btn btn-danger btn-sm" onclick="handleLogout()" style="padding: 4px 10px; font-size: 12px;">Sign Out</button>
      </div>
    </header>

    <!-- Role-Specific Navigation Bar -->
    <nav class="nav-bar">
      <div class="nav-links">
        ${getNavLinksForRole(state.currentUser.role)}
      </div>
      <div>
        <span class="badge badge-green" style="font-size: 11px;">AUTH: ${state.currentUser.username} (${state.currentUser.role})</span>
      </div>
    </nav>

    <!-- Role Workspace -->
    <main id="portalWorkspace" class="container"></main>

    <!-- Global Modal Host -->
    <div id="modalHost"></div>
  `;

  renderPortalWorkspace();
}

function getPortalTitleByRole(role) {
  if (role === 'ROLE_APPLICANT') return 'Citizen & Enterprise Grant Application Portal';
  if (role === 'ROLE_PROGRAM_OFFICER') return 'Ministry Program Officer Scheme & Sanction Desk';
  if (role === 'ROLE_REVIEWER') return 'Evaluation Committee & Technical Peer Review Desk';
  return 'National Platform Administration & Security Desk';
}

function getRoleBadgeName(role) {
  return role.replace('ROLE_', '').replace('_', ' ');
}

function getNavLinksForRole(role) {
  if (role === 'ROLE_APPLICANT') {
    return `
      <button class="nav-btn ${state.currentTab === 'applicant_schemes' ? 'active' : ''}" onclick="switchPortalTab('applicant_schemes')">Browse Grant Schemes</button>
      <button class="nav-btn ${state.currentTab === 'applicant_my_apps' ? 'active' : ''}" onclick="switchPortalTab('applicant_my_apps')">My Submitted Applications</button>
      <button class="nav-btn ${state.currentTab === 'applicant_apply' ? 'active' : ''}" onclick="switchPortalTab('applicant_apply')">+ Apply for Grant</button>
      <button class="nav-btn ${state.currentTab === 'applicant_uc' ? 'active' : ''}" onclick="switchPortalTab('applicant_uc')">Milestone Progress & UCs</button>
    `;
  } else if (role === 'ROLE_PROGRAM_OFFICER') {
    return `
      <button class="nav-btn ${state.currentTab === 'officer_overview' ? 'active' : ''}" onclick="switchPortalTab('officer_overview')">Officer Dashboard</button>
      <button class="nav-btn ${state.currentTab === 'officer_schemes' ? 'active' : ''}" onclick="switchPortalTab('officer_schemes')">Scheme Management (M1)</button>
      <button class="nav-btn ${state.currentTab === 'officer_scrutiny' ? 'active' : ''}" onclick="switchPortalTab('officer_scrutiny')">Scrutiny & Sanctions (M2/M3)</button>
      <button class="nav-btn ${state.currentTab === 'officer_disbursements' ? 'active' : ''}" onclick="switchPortalTab('officer_disbursements')">PFMS Disbursements & UCs (M4)</button>
    `;
  } else if (role === 'ROLE_REVIEWER') {
    return `
      <button class="nav-btn ${state.currentTab === 'reviewer_queue' ? 'active' : ''}" onclick="switchPortalTab('reviewer_queue')">My Assigned Review Queue</button>
    `;
  } else {
    // Admin
    return `
      <button class="nav-btn ${state.currentTab === 'admin_overview' ? 'active' : ''}" onclick="switchPortalTab('admin_overview')">Executive Dashboard</button>
      <button class="nav-btn ${state.currentTab === 'admin_users' ? 'active' : ''}" onclick="switchPortalTab('admin_users')">User & Role Management</button>
      <button class="nav-btn ${state.currentTab === 'admin_audit' ? 'active' : ''}" onclick="switchPortalTab('admin_audit')">Security Audit Logs</button>
    `;
  }
}

function switchPortalTab(tab) {
  state.currentTab = tab;
  renderApp();
}

// =============================================================================
// AUTHENTICATION GATE (LOGIN & REGISTRATION SCREEN)
// =============================================================================
function renderLoginScreen(root) {
  const isRegister = state.authMode === 'register';

  root.innerHTML = `
    <div style="min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;">
      <div style="width: 100%; max-width: 540px; background: #ffffff; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden;">
        <!-- Gov Header Banner -->
        <div style="background: linear-gradient(135deg, #0b1f3a 0%, #1e3a8a 100%); color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #f59e0b;">
          <div style="display: inline-block; background: #f59e0b; color: #0b1f3a; font-weight: 800; font-size: 14px; padding: 4px 10px; border-radius: 4px; margin-bottom: 8px;">GOVERNMENT OF INDIA</div>
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">Grants Management System (J18)</h2>
          <p style="font-size: 13px; color: #bfdbfe;">Public Sector Scheme Formulation, Grant Sanction & PFMS Tracking</p>
        </div>

        <!-- Mode Toggle Tabs (Sign In vs Register) -->
        <div style="display: flex; border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
          <button type="button" onclick="setAuthMode('login')" style="flex: 1; padding: 12px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; background: ${!isRegister ? '#ffffff' : '#f8fafc'}; color: ${!isRegister ? '#1e3a8a' : '#64748b'}; border-bottom: ${!isRegister ? '3px solid #2563eb' : 'none'};">
            Sign In Existing User
          </button>
          <button type="button" onclick="setAuthMode('register')" style="flex: 1; padding: 12px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; background: ${isRegister ? '#ffffff' : '#f8fafc'}; color: ${isRegister ? '#1e3a8a' : '#64748b'}; border-bottom: ${isRegister ? '3px solid #2563eb' : 'none'};">
            + Register New Applicant
          </button>
        </div>

        <div style="padding: 24px 28px;">
          ${!isRegister ? `
            <!-- Sign In Form -->
            <form onsubmit="handleManualLogin(event)">
              <div class="form-group" style="margin-bottom: 14px;">
                <label>Username / Official ID</label>
                <input type="text" id="loginUsername" class="form-input" required placeholder="e.g. officer_sharma or applicant_patel" value="officer_sharma">
              </div>
              <div class="form-group" style="margin-bottom: 18px;">
                <label>Password</label>
                <input type="password" id="loginPassword" class="form-input" required value="Password@123">
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 10px; font-size: 14px;">
                Sign In to Official Portal
              </button>
            </form>

            <div style="margin: 20px 0 14px; display: flex; align-items: center; text-align: center; color: #94a3b8; font-size: 12px;">
              <div style="flex: 1; height: 1px; background: #e2e8f0;"></div>
              <span style="padding: 0 10px; font-weight: 600; text-transform: uppercase;">Or 1-Click Quick Login by Role</span>
              <div style="flex: 1; height: 1px; background: #e2e8f0;"></div>
            </div>

            <!-- Quick Persona Selector Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div onclick="quickLogin('applicant_patel')" style="cursor: pointer; padding: 10px; border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 8px; text-align: left; transition: all 0.15s;">
                <div style="font-weight: 700; color: #1e40af; font-size: 12px;">📝 Grant Applicant</div>
                <div style="font-size: 11px; color: #3b82f6;">Chirag Patel (Startup)</div>
              </div>

              <div onclick="quickLogin('officer_sharma')" style="cursor: pointer; padding: 10px; border: 1px solid #fed7aa; background: #fff7ed; border-radius: 8px; text-align: left; transition: all 0.15s;">
                <div style="font-weight: 700; color: #c2410c; font-size: 12px;">🏛️ Program Officer</div>
                <div style="font-size: 11px; color: #ea580c;">Sunita Sharma (DST)</div>
              </div>

              <div onclick="quickLogin('reviewer_kapoor')" style="cursor: pointer; padding: 10px; border: 1px solid #ddd6fe; background: #faf5ff; border-radius: 8px; text-align: left; transition: all 0.15s;">
                <div style="font-weight: 700; color: #6b21a8; font-size: 12px;">🔬 Peer Reviewer</div>
                <div style="font-size: 11px; color: #9333ea;">Dr. Alok Kapoor (IIT Delhi)</div>
              </div>

              <div onclick="quickLogin('admin')" style="cursor: pointer; padding: 10px; border: 1px solid #bbf7d0; background: #f0fdf4; border-radius: 8px; text-align: left; transition: all 0.15s;">
                <div style="font-weight: 700; color: #15803d; font-size: 12px;">⚙️ System Admin</div>
                <div style="font-size: 11px; color: #16a34a;">Rajesh Verma (NIC)</div>
              </div>
            </div>
          ` : `
            <!-- Self-Registration Form for Applicants -->
            <form onsubmit="handleSelfRegistration(event)">
              <div class="form-grid">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input type="text" id="regFullName" class="form-input" required placeholder="e.g. Vikram Malhotra">
                </div>
                <div class="form-group">
                  <label>Legal Organization / Enterprise *</label>
                  <input type="text" id="regOrg" class="form-input" required placeholder="e.g. Malho AgriTech Innovations">
                </div>
                <div class="form-group">
                  <label>Legal Entity Type *</label>
                  <select id="regOrgType" class="form-select" required>
                    <option value="Startup">DPIIT Recognized Startup</option>
                    <option value="MSME">Registered MSME (Udyam)</option>
                    <option value="NGO / Trust">Registered NGO / Section 8</option>
                    <option value="Academic Institution">Research Lab / University</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Official Email *</label>
                  <input type="email" id="regEmail" class="form-input" required placeholder="vikram@malhotech.in">
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input type="text" id="regPhone" class="form-input" placeholder="+91 98765 43210">
                </div>
                <div class="form-group">
                  <label>Desired Username *</label>
                  <input type="text" id="regUsername" class="form-input" required placeholder="vikram_malhotra">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                  <label>Password *</label>
                  <input type="password" id="regPassword" class="form-input" required value="Password@123">
                </div>
              </div>

              <div style="margin-top: 16px;">
                <button type="submit" class="btn btn-success" style="width: 100%; justify-content: center; padding: 10px; font-size: 14px;">
                  Create Account & Open Applicant Portal >>
                </button>
              </div>
            </form>
          `}
        </div>
      </div>
      <div style="margin-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
        ABES Engineering College | MCA 2nd Year | Project J18 | Spring Boot 3 & Angular 14
      </div>
    </div>
  `;
}

function setAuthMode(mode) {
  state.authMode = mode;
  renderApp();
}

async function handleSelfRegistration(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const fullName = document.getElementById('regFullName').value.trim();
  const org = document.getElementById('regOrg').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;

  const newUser = {
    userId: Object.keys(USERS_DB).length + 10,
    username: username,
    fullName: fullName,
    email: email,
    phoneNumber: phone,
    organizationName: org,
    role: 'ROLE_APPLICANT'
  };

  // Persist locally in USERS_DB
  USERS_DB[username] = newUser;

  // Attempt backend register
  try {
    await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        fullName,
        email,
        phoneNumber: phone,
        organizationName: org,
        roleName: 'ROLE_APPLICANT'
      })
    });
  } catch (err) {}

  // Log in immediately
  state.currentUser = newUser;
  localStorage.setItem('gms_session_user', JSON.stringify(newUser));
  setDefaultTabForRole(newUser.role);

  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${newUser.fullName} (Self-Registered)`,
    action: 'REGISTER',
    entity: newUser.username,
    ip: '127.0.0.1',
    details: `New Applicant registered: ${newUser.fullName} (${newUser.organizationName}).`
  });

  renderApp();
  alert(`Account Created Successfully!\nWelcome to the Grants Management System, ${fullName}.\nYou are now logged into the Grant Applicant Portal.`);
}

function handleManualLogin(e) {
  e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  quickLogin(u);
}

function quickLogin(username) {
  const user = USERS_DB[username] || {
    userId: 99,
    username: username,
    fullName: username.toUpperCase(),
    role: username.includes('officer') ? 'ROLE_PROGRAM_OFFICER' : (username.includes('rev') ? 'ROLE_REVIEWER' : 'ROLE_APPLICANT'),
    organizationName: 'Public Sector Participant'
  };

  state.currentUser = user;
  localStorage.setItem('gms_session_user', JSON.stringify(user));
  setDefaultTabForRole(user.role);
  renderApp();
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('gms_session_user');
  renderApp();
}

// =============================================================================
// ROUTING TO ROLE WORKSPACES
// =============================================================================
function renderPortalWorkspace() {
  const host = document.getElementById('portalWorkspace');
  const role = state.currentUser.role;

  if (role === 'ROLE_APPLICANT') {
    renderApplicantPortal(host);
  } else if (role === 'ROLE_PROGRAM_OFFICER') {
    renderOfficerPortal(host);
  } else if (role === 'ROLE_REVIEWER') {
    renderReviewerPortal(host);
  } else if (role === 'ROLE_ADMIN') {
    renderAdminPortal(host);
  }
}

// =============================================================================
// 1. APPLICANT PORTAL (Citizen / Startup / MSME / NGO View)
// =============================================================================
function renderApplicantPortal(host) {
  if (state.currentTab === 'applicant_schemes') {
    // Browse Available Grant Schemes & Click to Apply
    host.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Open Central & State Government Grant Schemes</div>
            <div class="card-desc">Explore grant schemes currently accepting proposals. Review eligibility criteria before applying.</div>
          </div>
          <button class="btn btn-primary" onclick="switchPortalTab('applicant_apply')">+ Start New Application</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 16px;">
          ${state.programs.filter(p => p.status === 'ACTIVE').map(p => `
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="badge badge-blue">${p.category}</span>
                  <span class="badge badge-green">ACTIVE SCHEME</span>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${p.title}</h3>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;"><strong>Ministry:</strong> ${p.fundingAgency}</div>
                <p style="font-size: 13px; color: #334155; margin-bottom: 14px; line-height: 1.4;">${p.description}</p>
                
                <div style="background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 14px;">
                  <div><strong>Grant Ceiling:</strong> ${formatINR(p.minGrantAmount)} – ${formatINR(p.maxGrantAmount)}</div>
                  <div><strong>Submission Horizon:</strong> ${p.startDate} to ${p.endDate}</div>
                  <div><strong>Eligibility Summary:</strong> ${p.eligibilitySummary || 'Eligible MSMEs and Startups'}</div>
                </div>
              </div>
              <button class="btn btn-primary" onclick="preselectSchemeAndApply(${p.programId})" style="width: 100%; justify-content: center;">
                Apply for this Scheme >>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (state.currentTab === 'applicant_my_apps') {
    // My Submitted Applications
    const myApps = state.applications.filter(a => a.applicant && a.applicant.username === state.currentUser.username);
    host.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">My Submitted Grant Applications</div>
            <div class="card-desc">Track proposal submission status, automated eligibility reports, and sanction orders.</div>
          </div>
          <button class="btn btn-primary" onclick="switchPortalTab('applicant_apply')">+ New Application</button>
        </div>

        ${myApps.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: #64748b;">
            <p>You have not submitted any grant proposals yet.</p>
            <button class="btn btn-primary" onclick="switchPortalTab('applicant_apply')" style="margin-top: 12px;">Submit Your First Application</button>
          </div>
        ` : `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Application No</th>
                  <th>Project Title</th>
                  <th>Grant Scheme</th>
                  <th>Requested</th>
                  <th>Approved</th>
                  <th>Automated Eligibility</th>
                  <th>Workflow Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${myApps.map(a => `
                  <tr>
                    <td><strong>${a.applicationNumber}</strong></td>
                    <td>
                      <div style="font-weight: 600;">${a.projectTitle}</div>
                      <small style="color: #64748b;">Submitted: ${a.submissionDate}</small>
                    </td>
                    <td>${a.program ? a.program.title : 'Scheme'}</td>
                    <td><strong>${formatINR(a.requestedAmount)}</strong></td>
                    <td><strong style="color: #059669;">${a.approvedAmount ? formatINR(a.approvedAmount) : 'Pending Sanction'}</strong></td>
                    <td>
                      ${getStatusBadge(a.eligibilityStatus)}
                      <div style="font-size: 11px; color: #475569; margin-top: 2px;">${a.eligibilityRemarks}</div>
                    </td>
                    <td>${getStatusBadge(a.status)}</td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="viewApplicationDetail(${a.applicationId})">Inspect Dossier</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  } else if (state.currentTab === 'applicant_apply') {
    // New Application Submission Form
    renderApplicantForm(host);
  } else if (state.currentTab === 'applicant_uc') {
    // Milestone Reports
    renderApplicantUCView(host);
  }
}

function preselectSchemeAndApply(progId) {
  state.selectedProgramId = progId;
  switchPortalTab('applicant_apply');
}

function renderApplicantForm(host) {
  host.innerHTML = `
    <div class="card" style="max-width: 900px; margin: 0 auto;">
      <div class="card-header">
        <div>
          <div class="card-title">New Grant Application Submission Form</div>
          <div class="card-desc">Enter organizational credentials and project proposal details. System evaluates eligibility automatically upon submission.</div>
        </div>
      </div>

      <form onsubmit="handleApplicantSubmit(event)">
        <!-- Step 1: Target Scheme -->
        <div style="background: #eff6ff; padding: 16px; border-radius: 8px; border: 1px solid #bfdbfe; margin-bottom: 20px;">
          <label style="font-weight: 700; color: #1e40af; font-size: 13px; display: block; margin-bottom: 6px;">1. Target Grant Scheme *</label>
          <select id="appProgSelect" class="form-select" required style="font-weight: 600;">
            ${state.programs.map(p => `
              <option value="${p.programId}" ${state.selectedProgramId === p.programId ? 'selected' : ''}>
                ${p.programCode} - ${p.title} (Allowable: ${formatINR(p.minGrantAmount)} to ${formatINR(p.maxGrantAmount)})
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Step 2: Legal Organization Profile -->
        <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">2. Legal Organization Credentials (Checked by Rule Engine)</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Legal Entity Type *</label>
            <select id="appOrgType" class="form-select" required>
              <option value="Startup">DPIIT Recognized Startup</option>
              <option value="MSME">Registered MSME (Udyam)</option>
              <option value="Cooperative Society">Cooperative Society</option>
              <option value="NGO / Trust">Section 8 / Registered NGO</option>
              <option value="Academic Institution">University / Research Lab</option>
            </select>
          </div>
          <div class="form-group">
            <label>Years in Operation * (Eligibility Checked)</label>
            <input type="number" id="appYears" class="form-input" required value="3" min="0">
          </div>
          <div class="form-group">
            <label>Organization PAN (10 Characters) *</label>
            <input type="text" id="appPan" class="form-input" required value="AAACK1234F" maxlength="10">
          </div>
          <div class="form-group">
            <label>GSTIN Number *</label>
            <input type="text" id="appGstin" class="form-input" required value="24AAACK1234F1Z8">
          </div>
          <div class="form-group">
            <label>Annual Turnover (INR) *</label>
            <input type="number" id="appTurnover" class="form-input" required value="12000000">
          </div>
          <div class="form-group">
            <label>State & District *</label>
            <input type="text" id="appLocation" class="form-input" required value="Surat, Gujarat">
          </div>
        </div>

        <!-- Step 3: Proposal Details -->
        <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 20px 0 12px;">3. Project Proposal & Financial Request</h4>
        <div class="form-group" style="margin-bottom: 12px;">
          <label>Project Proposal Title *</label>
          <input type="text" id="appTitle" class="form-input" required placeholder="e.g. Next-Gen Bio-Enzyme Conversion Plant">
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Requested Grant Amount (INR) *</label>
            <input type="number" id="appRequestedAmt" class="form-input" required value="4000000">
          </div>
          <div class="form-group">
            <label>Project Duration (Months) *</label>
            <input type="number" id="appDuration" class="form-input" required value="18" min="1">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label>Detailed Project Summary & Technical Scope *</label>
          <textarea id="appSummary" class="form-textarea" required placeholder="Explain technological innovation, work packages, milestones, and beneficiaries..."></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="switchPortalTab('applicant_my_apps')">Cancel</button>
          <button type="submit" class="btn btn-primary" style="padding: 10px 20px;">Run Eligibility Check & Submit Application >></button>
        </div>
      </form>
    </div>
  `;
}

function handleApplicantSubmit(e) {
  e.preventDefault();
  const progId = parseInt(document.getElementById('appProgSelect').value);
  const prog = state.programs.find(p => p.programId === progId) || state.programs[0];
  const reqAmt = parseFloat(document.getElementById('appRequestedAmt').value);
  const years = parseInt(document.getElementById('appYears').value);

  // Client-side execution of Eligibility Engine
  let isEligible = true;
  let remarks = [];

  if (reqAmt < prog.minGrantAmount || reqAmt > prog.maxGrantAmount) {
    isEligible = false;
    remarks.push(`Requested amount (${formatINR(reqAmt)}) outside allowed ceiling (${formatINR(prog.minGrantAmount)} - ${formatINR(prog.maxGrantAmount)}).`);
  }
  if (years < 2) {
    isEligible = false;
    remarks.push(`Failed MIN_OPERATING_YEARS (Required: 2, Actual: ${years}).`);
  }
  if (remarks.length === 0) {
    remarks.push('All mandatory program criteria and grant ceilings validated successfully.');
  }

  const newApp = {
    applicationId: state.applications.length + 1,
    applicationNumber: `APP-2025-${Math.floor(Math.random()*90000)+10000}`,
    program: prog,
    applicant: state.currentUser,
    projectTitle: document.getElementById('appTitle').value,
    projectSummary: document.getElementById('appSummary').value,
    requestedAmount: reqAmt,
    approvedAmount: null,
    projectDurationMonths: parseInt(document.getElementById('appDuration').value),
    organizationType: document.getElementById('appOrgType').value,
    organizationPan: document.getElementById('appPan').value,
    organizationGstin: document.getElementById('appGstin').value,
    annualTurnover: parseFloat(document.getElementById('appTurnover').value),
    yearsInOperation: years,
    stateOrRegion: document.getElementById('appLocation').value.split(',')[1] || 'State',
    district: document.getElementById('appLocation').value.split(',')[0] || 'District',
    eligibilityStatus: isEligible ? 'AUTO_ELIGIBLE' : 'AUTO_INELIGIBLE',
    eligibilityRemarks: remarks.join('; '),
    status: 'SUBMITTED',
    submissionDate: new Date().toISOString().substring(0, 10),
    assignedReviewer: null,
    reviewScores: null
  };

  state.applications.unshift(newApp);

  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser.fullName} (Applicant)`,
    action: 'SUBMIT',
    entity: newApp.applicationNumber,
    ip: '127.0.0.1',
    details: `Application submitted. Eligibility Verdict: ${newApp.eligibilityStatus}.`
  });

  alert(`Application Submitted Successfully!\n\nApplication Number: ${newApp.applicationNumber}\nAutomated Eligibility: ${newApp.eligibilityStatus}\nAudit Notes: ${newApp.eligibilityRemarks}`);
  switchPortalTab('applicant_my_apps');
}

function renderApplicantUCView(host) {
  host.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Milestone Progress & Utilization Certificate (UC) Submission</div>
          <div class="card-desc">For approved and disbursed grants: Submit milestone achievements and expenditure vouchers to unlock subsequent tranches.</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Sanctioned Application</th>
              <th>Sanctioned Amount</th>
              <th>Milestone Title & Scope</th>
              <th>Claimed Expenditure</th>
              <th>Progress %</th>
              <th>Audit Status</th>
              <th>Officer Verification Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${state.utilizationReports.map(u => `
              <tr>
                <td><strong>${u.application ? u.application.applicationNumber : 'APP'}</strong></td>
                <td><strong>${formatINR(u.application ? u.application.approvedAmount : 4200000)}</strong></td>
                <td>
                  <div style="font-weight: 600;">${u.milestoneTitle}</div>
                  <small style="color: #64748b;">${u.progressNarrative}</small>
                </td>
                <td><strong>${formatINR(u.amountUtilized)}</strong></td>
                <td><strong style="color: #059669;">${u.utilizationPercentage}%</strong></td>
                <td>${getStatusBadge(u.verificationStatus)}</td>
                <td style="font-size: 11px; color: #475569;">${u.verificationRemarks || 'Site inspection audit pending.'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 20px; text-align: right;">
        <button class="btn btn-primary" onclick="openSubmitUCModal()">+ Submit New Utilization Certificate</button>
      </div>
    </div>
  `;
}

// =============================================================================
// 2. PROGRAM OFFICER PORTAL (Ministry / DST Officer View)
// =============================================================================
function renderOfficerPortal(host) {
  if (state.currentTab === 'officer_overview') {
    renderDashboard(host);
  } else if (state.currentTab === 'officer_schemes') {
    renderPrograms(host);
  } else if (state.currentTab === 'officer_scrutiny') {
    renderOfficerScrutinyDesk(host);
  } else if (state.currentTab === 'officer_disbursements') {
    renderOfficerDisbursementDesk(host);
  }
}

function renderOfficerScrutinyDesk(host) {
  host.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Application Scrutiny & Sanction Order Desk (M2 / M3)</div>
          <div class="card-desc">Inspect automated eligibility results, assign peer reviewers, inspect evaluation scorecards, and issue Sanction Orders.</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>App Number</th>
              <th>Project Title & Scheme</th>
              <th>Applicant Entity</th>
              <th>Requested (INR)</th>
              <th>Automated Eligibility</th>
              <th>Assigned Reviewer</th>
              <th>Peer Score</th>
              <th>Status</th>
              <th>Officer Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.applications.map(a => `
              <tr>
                <td><strong>${a.applicationNumber}</strong></td>
                <td>
                  <div style="font-weight: 600;">${a.projectTitle}</div>
                  <small style="color: #64748b;">${a.program ? a.program.title : 'Scheme'}</small>
                </td>
                <td>
                  <div>${a.applicant ? a.applicant.fullName : 'Applicant'}</div>
                  <small style="color: #64748b;">${a.organizationType} • ${a.stateOrRegion}</small>
                </td>
                <td><strong>${formatINR(a.requestedAmount)}</strong></td>
                <td>
                  ${getStatusBadge(a.eligibilityStatus)}
                  <div style="font-size: 10px; color: #475569; max-width: 200px;">${a.eligibilityRemarks}</div>
                </td>
                <td>
                  ${a.assignedReviewer ? `
                    <div style="font-size: 12px; font-weight: 600;">${a.assignedReviewer.fullName}</div>
                    <small style="color: #64748b;">${a.assignedReviewer.organizationName}</small>
                  ` : `
                    <button class="btn btn-secondary btn-sm" onclick="openAssignReviewerModal(${a.applicationId})">Assign Reviewer</button>
                  `}
                </td>
                <td>
                  ${a.reviewScores ? `
                    <span class="badge badge-purple" style="font-size: 12px;">${a.reviewScores.total} / 100</span>
                    <div style="font-size: 10px; color: #059669; font-weight: 600;">${a.reviewScores.recommendation}</div>
                  ` : `
                    <small style="color: #94a3b8;">Pending Review</small>
                  `}
                </td>
                <td>${getStatusBadge(a.status)}</td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-secondary btn-sm" onclick="viewApplicationDetail(${a.applicationId})">Inspect</button>
                    ${a.status !== 'APPROVED' && a.status !== 'DISBURSED' && a.status !== 'REJECTED' ? `
                      <button class="btn btn-primary btn-sm" onclick="openDecisionModal(${a.applicationId})">Sanction</button>
                    ` : `
                      <span class="badge badge-green">Order Issued</span>
                    `}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAssignReviewerModal(appId) {
  const app = state.applications.find(a => a.applicationId === appId);
  if (!app) return;

  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Assign Technical Reviewer: ${app.applicationNumber}</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleAssignReviewer(event, ${appId})">
          <p style="font-size: 13px; color: #475569; margin-bottom: 16px;">
            Select an accredited domain expert or academic reviewer from the Technical Evaluation Panel:
          </p>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Accredited Reviewer *</label>
            <select id="selReviewerId" class="form-select" required>
              <option value="reviewer_kapoor">Dr. Alok Kapoor - Professor, IIT Delhi (Dept of Electrical & IoT Engg)</option>
              <option value="reviewer_iyer">Dr. Meenakshi Iyer - Principal Investigator, IISc Bangalore (Bio-Systems)</option>
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Confirm Review Assignment</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function handleAssignReviewer(e, appId) {
  e.preventDefault();
  const revKey = document.getElementById('selReviewerId').value;
  const rev = USERS_DB[revKey] || { fullName: 'Dr. Alok Kapoor', organizationName: 'IIT Delhi' };

  const app = state.applications.find(a => a.applicationId === appId);
  if (app) {
    app.assignedReviewer = rev;
    app.status = 'UNDER_REVIEW';
  }

  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser.fullName} (Officer)`,
    action: 'ASSIGN_REVIEWER',
    entity: app.applicationNumber,
    ip: '10.20.1.45',
    details: `Assigned technical appraisal to ${rev.fullName}.`
  });

  saveStateToStorage();
  closeModal();
  renderApp();
  alert(`Assigned ${app.applicationNumber} to ${rev.fullName}. Proposal is now UNDER_REVIEW.`);
}

function renderOfficerDisbursementDesk(host) {
  host.innerHTML = `
    <!-- Multi-Tranche Disbursements -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">PFMS Grant Disbursement Execution Desk (Module 4)</div>
          <div class="card-desc">Execute multi-tranche disbursements to verified bank accounts. Automatically updates scheme budget counters.</div>
        </div>
        <button class="btn btn-primary" onclick="openScheduleDisbModal()">+ Schedule New Tranche</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>PFMS Reference</th>
              <th>Sanctioned Application</th>
              <th>Tranche</th>
              <th>Amount (INR)</th>
              <th>Mode</th>
              <th>Bank / Masked A/C</th>
              <th>IFSC</th>
              <th>Status</th>
              <th>Execution Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.disbursements.map(d => `
              <tr>
                <td><strong>${d.disbursementReference}</strong></td>
                <td>${d.application ? d.application.applicationNumber : 'APP'}</td>
                <td><span class="badge badge-purple">Tranche ${d.trancheNumber}</span></td>
                <td><strong>${formatINR(d.disbursementAmount)}</strong></td>
                <td>${d.paymentMethod}</td>
                <td>${d.bankName} (${d.accountNumberMasked})</td>
                <td>${d.ifscCode}</td>
                <td>${getStatusBadge(d.status)}</td>
                <td>
                  ${d.status === 'SCHEDULED' ? `
                    <button class="btn btn-success btn-sm" onclick="executeDisbursementNow(${d.disbursementId})">Trigger PFMS Payment</button>
                  ` : `
                    <span class="badge badge-green">Voucher Executed (${d.disbursementDate})</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Utilization Certificate Verification -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Milestone Utilization Certificate (UC) Verification Desk</div>
          <div class="card-desc">Physical audit & voucher scrutiny before unlocking subsequent tranches.</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Milestone Scope</th>
              <th>Claimed Expenditure</th>
              <th>Progress %</th>
              <th>Audit Status</th>
              <th>Officer Verification Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.utilizationReports.map(u => `
              <tr>
                <td><strong>${u.application ? u.application.applicationNumber : 'APP'}</strong></td>
                <td>
                  <div style="font-weight: 600;">${u.milestoneTitle}</div>
                  <small style="color: #64748b;">${u.progressNarrative}</small>
                </td>
                <td><strong>${formatINR(u.amountUtilized)}</strong></td>
                <td><strong style="color: #059669;">${u.utilizationPercentage}%</strong></td>
                <td>${getStatusBadge(u.verificationStatus)}</td>
                <td style="font-size: 11px; color: #475569;">${u.verificationRemarks || 'Pending site visit inspection.'}</td>
                <td>
                  ${u.verificationStatus === 'PENDING_VERIFICATION' ? `
                    <button class="btn btn-success btn-sm" onclick="verifyUCReport(${u.reportId})">Verify & Pass UC</button>
                  ` : `
                    <span class="badge badge-green">Passed</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openScheduleDisbModal() {
  const approvedApps = state.applications.filter(a => a.status === 'APPROVED' || a.status === 'DISBURSED');
  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Schedule Disbursement Tranche (PFMS)</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleScheduleDisbSubmit(event)">
          <div class="form-group" style="margin-bottom: 12px;">
            <label>Select Sanctioned Application *</label>
            <select id="disbAppId" class="form-select" required>
              ${approvedApps.map(a => `
                <option value="${a.applicationId}">${a.applicationNumber} - ${a.projectTitle} (Sanctioned: ${formatINR(a.approvedAmount || a.requestedAmount)})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Tranche Number *</label>
              <input type="number" id="disbTranche" class="form-input" required value="2" min="1">
            </div>
            <div class="form-group">
              <label>Disbursement Amount (INR) *</label>
              <input type="number" id="disbAmt" class="form-input" required value="1700000">
            </div>
            <div class="form-group">
              <label>Payment Method *</label>
              <select id="disbMethod" class="form-select" required>
                <option value="PFMS_NEFT">PFMS NEFT Transfer</option>
                <option value="RTGS">Treasury RTGS</option>
                <option value="DIRECT_BENEFIT_TRANSFER">Direct Benefit Transfer (DBT)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Bank Name *</label>
              <input type="text" id="disbBank" class="form-input" required value="State Bank of India">
            </div>
            <div class="form-group">
              <label>Beneficiary Masked A/C *</label>
              <input type="text" id="disbAcc" class="form-input" required value="XXXXXX1234">
            </div>
            <div class="form-group">
              <label>IFSC Code *</label>
              <input type="text" id="disbIfsc" class="form-input" required value="SBIN0001234">
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Scheduled Payment Date *</label>
            <input type="date" id="disbDate" class="form-input" required value="2025-02-15">
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Schedule Payment</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function handleScheduleDisbSubmit(e) {
  e.preventDefault();
  const appId = parseInt(document.getElementById('disbAppId').value);
  const app = state.applications.find(a => a.applicationId === appId);

  const newDisb = {
    disbursementId: state.disbursements.length + 1,
    application: app,
    trancheNumber: parseInt(document.getElementById('disbTranche').value),
    disbursementReference: `PFMS-TR-2025-${Math.floor(Math.random()*90000)+10000}`,
    disbursementAmount: parseFloat(document.getElementById('disbAmt').value),
    paymentMethod: document.getElementById('disbMethod').value,
    bankName: document.getElementById('disbBank').value,
    accountNumberMasked: document.getElementById('disbAcc').value,
    ifscCode: document.getElementById('disbIfsc').value,
    scheduledDate: document.getElementById('disbDate').value,
    status: 'SCHEDULED',
    remarks: 'Scheduled by Program Officer.'
  };

  state.disbursements.unshift(newDisb);
  closeModal();
  renderApp();
  alert(`Disbursement voucher ${newDisb.disbursementReference} scheduled successfully!`);
}

function executeDisbursementNow(disbId) {
  const disb = state.disbursements.find(d => d.disbursementId === disbId);
  if (!disb) return;

  const txn = prompt('Enter PFMS Payment Gateway Transaction Reference:', `PFMS${Date.now()}`);
  if (!txn) return;

  disb.status = 'DISBURSED';
  disb.transactionReference = txn;
  disb.disbursementDate = new Date().toISOString().substring(0, 10);

  state.stats.totalDisbursedBudget += disb.disbursementAmount;
  state.stats.budgetUtilizationRate = (state.stats.totalDisbursedBudget / state.stats.totalAllocatedBudget) * 100;

  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser.fullName} (Officer)`,
    action: 'DISBURSE',
    entity: disb.disbursementReference,
    ip: '10.20.1.45',
    details: `Executed PFMS tranche payment of INR ${disb.disbursementAmount}. Txn Ref: ${txn}`
  });

  renderApp();
  alert(`Disbursement ${disb.disbursementReference} executed via PFMS!\nAmount: ${formatINR(disb.disbursementAmount)}\nProgram Budget Tally Updated.`);
}

function verifyUCReport(repId) {
  const rep = state.utilizationReports.find(r => r.reportId === repId);
  if (!rep) return;

  const remarks = prompt('Enter Officer Verification Audit Remarks:', 'Physical site inspection verified by district officer. Vouchers audited.');
  if (remarks) {
    rep.verificationStatus = 'VERIFIED_SATISFACTORY';
    rep.verificationRemarks = remarks;
    renderApp();
    alert('Milestone Utilization Certificate verified satisfactory! Subsequent tranche unlocked.');
  }
}

function openSubmitUCModal() {
  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Submit Milestone Utilization Certificate</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleUCSubmit(event)">
          <div class="form-group" style="margin-bottom: 12px;">
            <label>Select Application *</label>
            <select id="ucAppId" class="form-select" required>
              ${state.applications.map(a => `
                <option value="${a.applicationId}">${a.applicationNumber} - ${a.projectTitle}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Tranche Number *</label>
              <input type="number" id="ucTranche" class="form-input" required value="1" min="1">
            </div>
            <div class="form-group">
              <label>Amount Utilized (INR) *</label>
              <input type="number" id="ucAmt" class="form-input" required value="2400000">
            </div>
            <div class="form-group">
              <label>Utilization Percentage (0-100) *</label>
              <input type="number" id="ucPct" class="form-input" required value="96" min="0" max="100">
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <label>Milestone Title *</label>
            <input type="text" id="ucTitle" class="form-input" required value="Civil work and equipment installation completed.">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Detailed Progress Narrative & Vouchers Summary *</label>
            <textarea id="ucNarrative" class="form-textarea" required>Procured all equipment and finished installation on site.</textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit for Officer Verification</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function handleUCSubmit(e) {
  e.preventDefault();
  const appId = parseInt(document.getElementById('ucAppId').value);
  const app = state.applications.find(a => a.applicationId === appId);

  const newUC = {
    reportId: state.utilizationReports.length + 1,
    application: app,
    trancheNumber: parseInt(document.getElementById('ucTranche').value),
    milestoneTitle: document.getElementById('ucTitle').value,
    amountUtilized: parseFloat(document.getElementById('ucAmt').value),
    utilizationPercentage: parseFloat(document.getElementById('ucPct').value),
    progressNarrative: document.getElementById('ucNarrative').value,
    verificationStatus: 'PENDING_VERIFICATION'
  };

  state.utilizationReports.unshift(newUC);
  closeModal();
  renderApp();
  alert('Utilization Certificate submitted! Awaiting Program Officer verification.');
}

// =============================================================================
// 3. REVIEWER PORTAL (Evaluation Committee View)
// =============================================================================
function renderReviewerPortal(host) {
  const assigned = state.applications.filter(a => a.assignedReviewer && a.assignedReviewer.username === state.currentUser.username);

  host.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Technical Evaluation Panel Review Queue</div>
          <div class="card-desc">Appraise assigned grant proposals across four standardized dimensions: Feasibility, Innovation, Budget Realism, and Social Impact.</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>App Number</th>
              <th>Project Proposal Title</th>
              <th>Grant Scheme</th>
              <th>Requested (INR)</th>
              <th>Applicant Organization</th>
              <th>Review Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${assigned.map(a => `
              <tr>
                <td><strong>${a.applicationNumber}</strong></td>
                <td>
                  <div style="font-weight: 600;">${a.projectTitle}</div>
                  <small style="color: #64748b;">${a.projectSummary.substring(0, 80)}...</small>
                </td>
                <td>${a.program ? a.program.title : 'Scheme'}</td>
                <td><strong>${formatINR(a.requestedAmount)}</strong></td>
                <td>${a.applicant ? a.applicant.organizationName : 'Applicant Corp'}</td>
                <td>
                  ${a.reviewScores ? `
                    <span class="badge badge-green">Score: ${a.reviewScores.total}/100 (${a.reviewScores.recommendation})</span>
                  ` : `
                    <span class="badge badge-yellow">Evaluation Pending</span>
                  `}
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="openScorecardModal(${a.applicationId})">
                    ${a.reviewScores ? 'Update Scorecard' : 'Score Rubric >>'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openScorecardModal(appId) {
  const app = state.applications.find(a => a.applicationId === appId);
  if (!app) return;

  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Evaluation Rubric Scorecard: ${app.applicationNumber}</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div>
          <p style="font-size: 13px; color: #475569; margin-bottom: 16px;">
            <strong>Project:</strong> ${app.projectTitle}<br>
            <strong>Organization:</strong> ${app.applicant ? app.applicant.organizationName : 'Applicant Corp'}<br>
            <strong>Requested Grant:</strong> ${formatINR(app.requestedAmount)}
          </p>

          <form onsubmit="handleSaveScorecard(event, ${appId})">
            <div class="score-box">
              <div class="score-header">
                <span>1. Technical Feasibility (0 - 25)</span>
                <span id="fVal" style="color: #2563eb;">23 / 25</span>
              </div>
              <input type="range" id="fScore" min="0" max="25" value="23" style="width: 100%;" oninput="updateScoreTotal()">
            </div>

            <div class="score-box">
              <div class="score-header">
                <span>2. Technological Innovation (0 - 25)</span>
                <span id="iVal" style="color: #2563eb;">22 / 25</span>
              </div>
              <input type="range" id="iScore" min="0" max="25" value="22" style="width: 100%;" oninput="updateScoreTotal()">
            </div>

            <div class="score-box">
              <div class="score-header">
                <span>3. Budget Realism & RoI (0 - 25)</span>
                <span id="bVal" style="color: #2563eb;">21 / 25</span>
              </div>
              <input type="range" id="bScore" min="0" max="25" value="21" style="width: 100%;" oninput="updateScoreTotal()">
            </div>

            <div class="score-box">
              <div class="score-header">
                <span>4. Social & Economic Impact (0 - 25)</span>
                <span id="sVal" style="color: #2563eb;">24 / 25</span>
              </div>
              <input type="range" id="sScore" min="0" max="25" value="24" style="width: 100%;" oninput="updateScoreTotal()">
            </div>

            <div style="background: #e0f2fe; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <span style="font-weight: 700; color: #0369a1;">Cumulative Scorecard Total:</span>
              <span id="totalScoreText" style="font-size: 20px; font-weight: 800; color: #0284c7;">90 / 100</span>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label>Reviewer Recommendation *</label>
              <select id="revRec" class="form-select" required>
                <option value="RECOMMEND_APPROVE">RECOMMEND APPROVE (High Priority Sanction)</option>
                <option value="NEEDS_REVISION">NEEDS REVISION (Request Additional Details)</option>
                <option value="RECOMMEND_REJECT">RECOMMEND REJECT (Fails Technology Feasibility)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label>Technical Evaluation Comments & Justification *</label>
              <textarea id="revComments" class="form-textarea" required>High technical merit with well conceived field validation plan. Recommended for sanction.</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 8px;">
              <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-success">Submit Evaluation Scorecard</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function updateScoreTotal() {
  const f = parseInt(document.getElementById('fScore').value) || 0;
  const i = parseInt(document.getElementById('iScore').value) || 0;
  const b = parseInt(document.getElementById('bScore').value) || 0;
  const s = parseInt(document.getElementById('sScore').value) || 0;

  document.getElementById('fVal').innerText = `${f} / 25`;
  document.getElementById('iVal').innerText = `${i} / 25`;
  document.getElementById('bVal').innerText = `${b} / 25`;
  document.getElementById('sVal').innerText = `${s} / 25`;

  const total = f + i + b + s;
  document.getElementById('totalScoreText').innerText = `${total} / 100`;
}

function handleSaveScorecard(e, appId) {
  e.preventDefault();
  const app = state.applications.find(a => a.applicationId === appId);
  if (!app) return;

  const f = parseInt(document.getElementById('fScore').value) || 0;
  const i = parseInt(document.getElementById('iScore').value) || 0;
  const b = parseInt(document.getElementById('bScore').value) || 0;
  const s = parseInt(document.getElementById('sScore').value) || 0;
  const rec = document.getElementById('revRec').value;
  const comm = document.getElementById('revComments').value;
  const total = f + i + b + s;

  const prevStatus = app.status || 'UNDER_REVIEW';
  // Update status according to evaluation recommendation (default approved)
  const newStatus = (rec === 'RECOMMEND_REJECT') ? 'REJECTED' : 'APPROVED';

  app.reviewScores = {
    feasibility: f,
    innovation: i,
    budget: b,
    social: s,
    total: total,
    recommendation: rec,
    comments: comm,
    reviewer: state.currentUser ? state.currentUser.fullName : 'Dr. Alok Kapoor',
    reviewerOrg: state.currentUser ? state.currentUser.organizationName : 'IIT Delhi',
    reviewDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  // UPDATE APPLICATION RECORD STATUS TO APPROVED
  app.status = newStatus;
  if (newStatus === 'APPROVED' && (!app.approvedAmount || app.approvedAmount === 0)) {
    app.approvedAmount = app.requestedAmount;
  }

  // Update Macro Analytics Stats
  if (state.stats) {
    if (newStatus === 'APPROVED') {
      state.stats.applicationsApproved = (state.stats.applicationsApproved || 0) + 1;
    }
    state.stats.applicationsUnderReview = Math.max(0, (state.stats.applicationsUnderReview || 1) - 1);
  }

  // Record definitive audit trail showing transition from UNDER_REVIEW to APPROVED
  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser ? state.currentUser.fullName : 'Reviewer'} (Evaluation Committee)`,
    action: 'REVIEW_APPROVED',
    entity: app.applicationNumber,
    ip: '14.139.45.10',
    details: `Evaluation Scorecard submitted (Score: ${total}/100, Recommendation: ${rec}). Proposal evaluated and marked APPROVED for grant sanction. Remarks: "${comm}"`
  });

  // Save to persistent storage so Program Officer immediately sees the update
  saveStateToStorage();

  closeModal();
  renderApp();
  alert(`Evaluation Scorecard Submitted Successfully!\n\nTotal Score: ${total}/100 (${rec})\nApplication ${app.applicationNumber} has been updated to APPROVED.\nThe Program Officer can now issue the Sanction Order or release disbursements.`);
}

function openDecisionModal(appId) {
  const app = state.applications.find(a => a.applicationId === appId);
  if (!app) return;

  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Sanction Committee Decision: ${app.applicationNumber}</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleDecisionSubmit(event, ${appId})">
          <div class="form-group" style="margin-bottom: 12px;">
            <label>Decision *</label>
            <select id="decType" class="form-select" required>
              <option value="APPROVE">SANCTION & APPROVE GRANT</option>
              <option value="REJECT">REJECT PROPOSAL</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <label>Approved Grant Amount (INR) *</label>
            <input type="number" id="decAmt" class="form-input" required value="${app.requestedAmount}">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Sanction Order Notes & Conditions *</label>
            <textarea id="decNotes" class="form-textarea" required>Sanction approved based on unanimous reviewer panel recommendation. Disbursement linked to milestone utilization certificates.</textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Confirm Sanction Order</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function handleDecisionSubmit(e, appId) {
  e.preventDefault();
  const dec = document.getElementById('decType').value;
  const amt = parseFloat(document.getElementById('decAmt').value);
  const notes = document.getElementById('decNotes').value;

  const app = state.applications.find(a => a.applicationId === appId);
  if (app) {
    app.status = dec === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    if (dec === 'APPROVE') app.approvedAmount = amt;
  }

  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser.fullName} (Officer)`,
    action: dec === 'APPROVE' ? 'APPROVE' : 'REJECT',
    entity: app.applicationNumber,
    ip: '10.20.1.45',
    details: `Sanction decision: ${dec}. Approved Amount: INR ${amt}. Notes: ${notes}`
  });

  saveStateToStorage();
  closeModal();
  renderApp();
  alert(`Decision Executed!\n${app.applicationNumber} status updated to ${app.status}.`);
}

// =============================================================================
// 4. SYSTEM ADMINISTRATOR PORTAL (Governance View)
// =============================================================================
function renderAdminPortal(host) {
  if (state.currentTab === 'admin_overview') {
    renderDashboard(host);
  } else if (state.currentTab === 'admin_users') {
    host.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">System Users & Role-Based Access Governance</div>
            <div class="card-desc">Active system stakeholders, permissions, and departmental affiliations.</div>
          </div>
          <button class="btn btn-primary" onclick="openAdminCreateUserModal()">+ Onboard New System User</button>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role Code</th>
                <th>Department / Organization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${Object.values(USERS_DB).map(u => `
                <tr>
                  <td><strong>${u.username}</strong></td>
                  <td>${u.fullName}</td>
                  <td>${u.email}</td>
                  <td><span class="role-tag">${u.role}</span></td>
                  <td>${u.organizationName}</td>
                  <td><span class="badge badge-green">ACTIVE</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (state.currentTab === 'admin_audit') {
    host.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Immutable Security & Transaction Audit Trail</div>
            <div class="card-desc">Complete event logs recording logins, scheme creation, eligibility evaluation, and PFMS disbursements.</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Actor</th>
                <th>Action Code</th>
                <th>Target Entity</th>
                <th>IP Address</th>
                <th>Audit Event Summary</th>
              </tr>
            </thead>
            <tbody>
              ${state.auditLogs.map(l => `
                <tr>
                  <td><small>${l.timestamp}</small></td>
                  <td><strong>${l.user}</strong></td>
                  <td><span class="badge badge-purple">${l.action}</span></td>
                  <td>${l.entity}</td>
                  <td><code>${l.ip}</code></td>
                  <td style="font-size: 12px; color: #334155;">${l.details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

function openAdminCreateUserModal() {
  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Onboard New Platform User / Official</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleAdminCreateUser(event)">
          <div class="form-grid">
            <div class="form-group">
              <label>Role Assignment *</label>
              <select id="admUserRole" class="form-select" required>
                <option value="ROLE_PROGRAM_OFFICER">Program Officer (Ministry / Agency Desk)</option>
                <option value="ROLE_REVIEWER">Technical Peer Reviewer (Evaluation Committee)</option>
                <option value="ROLE_APPLICANT">Grant Applicant (Citizen / Enterprise / NGO)</option>
                <option value="ROLE_ADMIN">System Administrator (NIC / Gov)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" id="admFullName" class="form-input" required placeholder="e.g. Dr. Ramesh Chander">
            </div>
            <div class="form-group">
              <label>Department / Organization *</label>
              <input type="text" id="admOrg" class="form-input" required placeholder="e.g. Ministry of Electronics & IT">
            </div>
            <div class="form-group">
              <label>Official Email *</label>
              <input type="email" id="admEmail" class="form-input" required placeholder="r.chander@meity.gov.in">
            </div>
            <div class="form-group">
              <label>Unique Username *</label>
              <input type="text" id="admUsername" class="form-input" required placeholder="officer_chander">
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" id="admPassword" class="form-input" required value="Password@123">
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Onboard User</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function handleAdminCreateUser(e) {
  e.preventDefault();
  const username = document.getElementById('admUsername').value.trim();
  const fullName = document.getElementById('admFullName').value.trim();
  const org = document.getElementById('admOrg').value.trim();
  const email = document.getElementById('admEmail').value.trim();
  const role = document.getElementById('admUserRole').value;

  const newUser = {
    userId: Object.keys(USERS_DB).length + 20,
    username,
    fullName,
    email,
    organizationName: org,
    role
  };

  USERS_DB[username] = newUser;

  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser.fullName} (Admin)`,
    action: 'CREATE_USER',
    entity: newUser.username,
    ip: '127.0.0.1',
    details: `Onboarded user: ${newUser.fullName} with role ${newUser.role}.`
  });

  closeModal();
  renderApp();
  alert(`User @${username} (${fullName}) onboarded successfully as ${role.replace('ROLE_', '')}!`);
}

// Shared Overview Dashboard
function renderDashboard(host) {
  const s = state.stats;
  host.innerHTML = `
    <!-- Top Metric KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Allocated Budget</div>
        <div class="kpi-value">${formatINR(s.totalAllocatedBudget)}</div>
        <div class="kpi-sub">${s.totalPrograms} Total Grant Schemes</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-title">Disbursed Funds to Date</div>
        <div class="kpi-value">${formatINR(s.totalDisbursedBudget)}</div>
        <div class="kpi-sub">${s.budgetUtilizationRate.toFixed(1)}% of total corpus released</div>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-title">Proposals in Pipeline</div>
        <div class="kpi-value">${s.totalApplications}</div>
        <div class="kpi-sub">${s.applicationsUnderReview} Under Peer Review</div>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-title">Sanctioned & Disbursed</div>
        <div class="kpi-value">${s.applicationsApproved + s.applicationsDisbursed}</div>
        <div class="kpi-sub">${s.applicationsDisbursed} Disbursed via PFMS/RTGS</div>
      </div>
    </div>

    <!-- Budget Allocation Meter -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Fiscal Year Fund Utilization Benchmark</div>
          <div class="card-desc">Real-time expenditure tracking against cabinet sanctioned grant ceilings</div>
        </div>
        <span class="badge badge-green" style="font-size: 13px;">${s.budgetUtilizationRate.toFixed(2)}% Disbursed</span>
      </div>
      <div class="progress-bar-bg" style="height: 14px;">
        <div class="progress-bar-fill" style="width: ${Math.min(s.budgetUtilizationRate, 100)}%;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #64748b;">
        <span>Sanctioned: ${formatINR(s.totalAllocatedBudget)}</span>
        <span>Remaining: ${formatINR(s.totalAllocatedBudget - s.totalDisbursedBudget)}</span>
      </div>
    </div>

    <!-- Recent Grant Applications Feed -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Grant Submissions & Sanctions Registry</div>
          <div class="card-desc">Proposals across sectors evaluated against scheme rubrics</div>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>App Number</th>
              <th>Applicant & Organization</th>
              <th>Project Title</th>
              <th>Requested (INR)</th>
              <th>Eligibility</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.applications.slice(0, 5).map(a => `
              <tr>
                <td><strong>${a.applicationNumber}</strong></td>
                <td>
                  <div>${a.applicant ? a.applicant.fullName : 'Applicant'}</div>
                  <small style="color: #64748b;">${a.organizationType} • ${a.stateOrRegion}</small>
                </td>
                <td>${a.projectTitle}</td>
                <td><strong>${formatINR(a.requestedAmount)}</strong></td>
                <td>${getStatusBadge(a.eligibilityStatus)}</td>
                <td>${getStatusBadge(a.status)}</td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="viewApplicationDetail(${a.applicationId})">Inspect</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Shared Programs View
function renderPrograms(host) {
  host.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Grant Programs Setup & Scheme Catalog (Module 1)</div>
          <div class="card-desc">Configure grant schemes, budget allocations, date horizons, and automated eligibility criteria</div>
        </div>
        <button class="btn btn-primary" onclick="openNewProgramModal()">+ Configure New Grant Program</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Scheme Code</th>
              <th>Grant Scheme Title & Agency</th>
              <th>Category</th>
              <th>Total Budget</th>
              <th>Disbursed</th>
              <th>Grant Range</th>
              <th>Tenure</th>
              <th>Status</th>
              <th>Criteria Rules</th>
            </tr>
          </thead>
          <tbody>
            ${state.programs.map(p => `
              <tr>
                <td><strong>${p.programCode}</strong></td>
                <td>
                  <div style="font-weight: 600; color: #0f172a;">${p.title}</div>
                  <small style="color: #64748b;">${p.fundingAgency}</small>
                </td>
                <td><span class="badge badge-blue">${p.category}</span></td>
                <td><strong>${formatINR(p.totalBudget)}</strong></td>
                <td>${formatINR(p.disbursedBudget)}</td>
                <td>${formatINR(p.minGrantAmount)} - ${formatINR(p.maxGrantAmount)}</td>
                <td><small>${p.startDate} to ${p.endDate}</small></td>
                <td>${getStatusBadge(p.status)}</td>
                <td>
                  <span class="badge badge-purple">${(p.criteria && p.criteria.length) || 0} Rules Configured</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openNewProgramModal() {
  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Create & Configure Grant Program (Module 1)</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleCreateProgram(event)">
          <div class="form-grid">
            <div class="form-group">
              <label>Program Code *</label>
              <input type="text" id="pCode" class="form-input" required value="GMS-2025-INNOV-${Math.floor(Math.random()*900)+100}">
            </div>
            <div class="form-group">
              <label>Scheme Title *</label>
              <input type="text" id="pTitle" class="form-input" required placeholder="e.g. Clean Water Technology Acceleration Grant">
            </div>
            <div class="form-group">
              <label>Sector / Category *</label>
              <select id="pCategory" class="form-select" required>
                <option value="Agriculture & Fisheries">Agriculture & Fisheries</option>
                <option value="Clean Energy">Clean Energy</option>
                <option value="Technology & Innovation">Technology & Innovation</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Women Entrepreneurship">Women Entrepreneurship</option>
              </select>
            </div>
            <div class="form-group">
              <label>Funding Agency / Ministry *</label>
              <input type="text" id="pAgency" class="form-input" required value="Department of Science & Technology">
            </div>
            <div class="form-group">
              <label>Total Budget Corpus (INR) *</label>
              <input type="number" id="pBudget" class="form-input" required value="30000000">
            </div>
            <div class="form-group">
              <label>Min Grant Ceiling (INR) *</label>
              <input type="number" id="pMinGrant" class="form-input" required value="1000000">
            </div>
            <div class="form-group">
              <label>Max Grant Ceiling (INR) *</label>
              <input type="number" id="pMaxGrant" class="form-input" required value="5000000">
            </div>
            <div class="form-group">
              <label>Start Date *</label>
              <input type="date" id="pStart" class="form-input" required value="2025-01-01">
            </div>
            <div class="form-group">
              <label>End Date *</label>
              <input type="date" id="pEnd" class="form-input" required value="2025-12-31">
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Program Description & Objectives</label>
            <textarea id="pDesc" class="form-textarea" placeholder="Detailed program scope, objectives, and eligible expenditures..."></textarea>
          </div>

          <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
            <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Configured Eligibility Rules (Engine Automated):</h4>
            <ul style="font-size: 12px; color: #475569; padding-left: 20px;">
              <li><strong>MIN_OPERATING_YEARS</strong>: Minimum 2 operational years (Mandatory)</li>
              <li><strong>ENTITY_TYPE_ALLOWED</strong>: Startup, MSME, or Cooperative (Mandatory)</li>
              <li><strong>GST_REGISTRATION</strong>: Valid Active GSTIN Certificate (Mandatory)</li>
            </ul>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save & Launch Scheme</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function handleCreateProgram(e) {
  e.preventDefault();
  const newProg = {
    programId: state.programs.length + 1,
    programCode: document.getElementById('pCode').value,
    title: document.getElementById('pTitle').value,
    category: document.getElementById('pCategory').value,
    fundingAgency: document.getElementById('pAgency').value,
    totalBudget: parseFloat(document.getElementById('pBudget').value),
    disbursedBudget: 0,
    minGrantAmount: parseFloat(document.getElementById('pMinGrant').value),
    maxGrantAmount: parseFloat(document.getElementById('pMaxGrant').value),
    startDate: document.getElementById('pStart').value,
    endDate: document.getElementById('pEnd').value,
    status: 'ACTIVE',
    description: document.getElementById('pDesc').value,
    criteria: [
      { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '2', isMandatory: 'Y', weightage: 30 },
      { criterionCode: 'ENTITY_TYPE_ALLOWED', criterionName: 'Entity Type Allowed', criterionType: 'IN_LIST', expectedValue: 'Startup,MSME', isMandatory: 'Y', weightage: 30 },
      { criterionCode: 'GST_REGISTRATION', criterionName: 'Valid GSTIN', criterionType: 'BOOLEAN', expectedValue: 'TRUE', isMandatory: 'Y', weightage: 40 }
    ]
  };

  state.programs.unshift(newProg);
  state.auditLogs.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user: `${state.currentUser.fullName} (Officer)`,
    action: 'CREATE_SCHEME',
    entity: newProg.programCode,
    ip: '10.20.1.45',
    details: `Created new grant program: ${newProg.title} with budget INR ${newProg.totalBudget}.`
  });

  saveStateToStorage();
  closeModal();
  renderApp();
  alert('Grant Program created successfully! Published to Applicant Catalog.');
}

// Inspect Application Detail
function viewApplicationDetail(appId) {
  const app = state.applications.find(a => a.applicationId === appId);
  if (!app) return;

  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Application Dossier: ${app.applicationNumber}</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="font-size: 15px; font-weight: 700;">${app.projectTitle}</span>
            <div>${getStatusBadge(app.status)} ${getStatusBadge(app.eligibilityStatus)}</div>
          </div>
          <table style="margin-bottom: 16px;">
            <tr><th style="width: 200px;">Grant Scheme</th><td>${app.program ? app.program.title : 'Scheme'}</td></tr>
            <tr><th>Applicant Name</th><td>${app.applicant ? app.applicant.fullName : 'Applicant'}</td></tr>
            <tr><th>Organization & Type</th><td>${app.applicant ? app.applicant.organizationName : 'Org'} (${app.organizationType})</td></tr>
            <tr><th>PAN / GSTIN</th><td>${app.organizationPan} / ${app.organizationGstin || 'N/A'}</td></tr>
            <tr><th>Turnover & Operating Age</th><td>${formatINR(app.annualTurnover)} • ${app.yearsInOperation} Years</td></tr>
            <tr><th>Requested / Approved</th><td>${formatINR(app.requestedAmount)} / <strong>${formatINR(app.approvedAmount)}</strong></td></tr>
            <tr><th>State & District</th><td>${app.stateOrRegion}, ${app.district}</td></tr>
            <tr><th>Project Summary</th><td>${app.projectSummary}</td></tr>
            <tr><th>Eligibility Remarks</th><td style="color: #0369a1; font-weight: 500;">${app.eligibilityRemarks}</td></tr>
          </table>

          ${app.reviewScores ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-weight: 700; color: #166534; font-size: 14px;">
                  Peer Review Evaluation Scorecard & Assessment
                </div>
                <div>
                  <span class="badge badge-green" style="font-size: 12px; font-weight: 700;">APPROVED</span>
                  <span class="badge badge-purple" style="font-size: 12px; font-weight: 700;">Score: ${app.reviewScores.total} / 100</span>
                </div>
              </div>
              <div style="font-size: 12px; color: #374151; margin-bottom: 10px;">
                <strong>Assigned Technical Reviewer:</strong> ${app.reviewScores.reviewer || (app.assignedReviewer ? app.assignedReviewer.fullName : 'Dr. Alok Kapoor')} (${app.reviewScores.reviewerOrg || 'Evaluation Panel'}) • <em>${app.reviewScores.reviewDate || 'Recently Evaluated'}</em>
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; text-align: center;">
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">FEASIBILITY</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.feasibility} / 25</div>
                </div>
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">INNOVATION</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.innovation} / 25</div>
                </div>
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">BUDGET REALISM</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.budget} / 25</div>
                </div>
                <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #d1fae5;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 600;">SOCIAL IMPACT</div>
                  <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${app.reviewScores.social} / 25</div>
                </div>
              </div>
              <div style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #d1fae5; font-size: 12px;">
                <div><strong>Recommendation:</strong> <span style="color: #059669; font-weight: 700;">${app.reviewScores.recommendation}</span></div>
                <div style="margin-top: 4px;"><strong>Reviewer Comments & Justification:</strong> ${app.reviewScores.comments}</div>
              </div>
            </div>
          ` : `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #64748b;">
              <strong>Peer Evaluation Status:</strong> Assigned to ${app.assignedReviewer ? app.assignedReviewer.fullName : 'Technical Committee'}. Review scorecard pending submission.
            </div>
          `}

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global Modal Helpers
function closeModal(e) {
  if (e && e.target && !e.target.classList.contains('modal-overlay') && !e.target.classList.contains('btn-secondary')) {
    return;
  }
  document.getElementById('modalHost').innerHTML = '';
}
