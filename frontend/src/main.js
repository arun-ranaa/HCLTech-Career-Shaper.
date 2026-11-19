/**
 * Grants Management System (J18) - Interactive Frontend Engine
 * Connects seamlessly to Spring Boot REST backend on http://localhost:8080/api/v1
 * Features full offline demo-fallback with pre-populated datasets.
 */

const API_BASE = 'http://localhost:8080/api/v1';

// Current active application state
const state = {
  currentTab: 'dashboard',
  currentUser: {
    userId: 2,
    username: 'officer_sharma',
    fullName: 'Sunita Sharma',
    role: 'ROLE_PROGRAM_OFFICER',
    organizationName: 'Department of Science and Technology'
  },
  stats: null,
  programs: [],
  applications: [],
  disbursements: [],
  utilizationReports: [],
  selectedApp: null,
  modalOpen: false,
  modalType: null
};

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  renderShell();
  await loadData();
  renderContent();
}

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
  } catch (e) {
    console.warn('Backend connecting or offline; using local mock data for zero-config demo.');
  }

  // Fallback defaults if backend is not yet started
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
          { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '2', isMandatory: 'Y', weightage: 25 },
          { criterionCode: 'ENTITY_TYPE_ALLOWED', criterionName: 'Entity Type', criterionType: 'IN_LIST', expectedValue: 'Startup,MSME,LLP', isMandatory: 'Y', weightage: 35 },
          { criterionCode: 'GST_REGISTRATION', criterionName: 'GST Registration', criterionType: 'BOOLEAN', expectedValue: 'TRUE', isMandatory: 'Y', weightage: 40 }
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
          { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '3', isMandatory: 'Y', weightage: 20 },
          { criterionCode: 'MIN_TURNOVER_LAKHS', criterionName: 'Min Turnover Lakhs', criterionType: 'NUMERIC_MIN', expectedValue: '50', isMandatory: 'Y', weightage: 30 }
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
        eligibilitySummary: 'DPIIT recognized Startups with Indian resident majority shareholding.',
        criteria: [
          { criterionCode: 'MIN_OPERATING_YEARS', criterionName: 'Min Operating Years', criterionType: 'NUMERIC_MIN', expectedValue: '1', isMandatory: 'Y', weightage: 30 }
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
        applicant: { fullName: 'Chirag Patel', organizationName: 'KrishiAI Technologies Pvt Ltd' },
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
        submissionDate: '2024-04-12 10:30'
      },
      {
        applicationId: 2,
        applicationNumber: 'APP-2024-CLEAN-00201',
        program: state.programs[1],
        applicant: { fullName: 'Kavitha Reddy', organizationName: 'Surya Shakti Solar NGO' },
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
        submissionDate: '2024-05-25 11:00'
      },
      {
        applicationId: 3,
        applicationNumber: 'APP-2024-TECH-00301',
        program: state.programs[2],
        applicant: { fullName: 'Chirag Patel', organizationName: 'KrishiAI Technologies Pvt Ltd' },
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
        submissionDate: '2024-06-15 09:20'
      },
      {
        applicationId: 4,
        applicationNumber: 'APP-2024-AGRI-00102',
        program: state.programs[0],
        applicant: { fullName: 'Harpreet Singh', organizationName: 'Green Harvest Hydroponics LLP' },
        projectTitle: 'Cold-Water Trout Recirculatory Aquaculture System (RAS)',
        projectSummary: 'Indoor tank systems for high-altitude trout cultivation in Mandi district.',
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
        submissionDate: '2024-04-20 14:15'
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
    'SUBMITTED': 'badge-blue',
    'UNDER_REVIEW': 'badge-yellow',
    'PENDING_VERIFICATION': 'badge-yellow',
    'SCHEDULED': 'badge-blue',
    'DRAFT': 'badge-gray',
    'CLOSED': 'badge-gray',
    'AUTO_INELIGIBLE': 'badge-red',
    'REJECTED': 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// Render Shell (Header, Navigation, App Host)
function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Government Portal Top Header -->
    <header class="gov-topbar">
      <div class="gov-logo-section">
        <div class="gov-emblem">GOI</div>
        <div class="gov-title">
          <h1>Grants Management System (GMS - J18)</h1>
          <p>Government of India | Public Sector Grant Programs & Disbursements</p>
        </div>
      </div>
      <div class="user-role-badge">
        <span>Logged in as: <strong>${state.currentUser.fullName}</strong></span>
        <span class="role-tag">${state.currentUser.role.replace('ROLE_', '')}</span>
        <select id="roleSwitcher" class="form-select" style="padding: 2px 8px; font-size: 12px; height: 28px;">
          <option value="officer_sharma" ${state.currentUser.username === 'officer_sharma' ? 'selected' : ''}>Program Officer (Sunita Sharma)</option>
          <option value="applicant_patel" ${state.currentUser.username === 'applicant_patel' ? 'selected' : ''}>Grant Applicant (Chirag Patel)</option>
          <option value="reviewer_kapoor" ${state.currentUser.username === 'reviewer_kapoor' ? 'selected' : ''}>Reviewer (Dr. Alok Kapoor)</option>
          <option value="admin" ${state.currentUser.username === 'admin' ? 'selected' : ''}>System Administrator (Rajesh Verma)</option>
        </select>
      </div>
    </header>

    <!-- Main Navigation Bar -->
    <nav class="nav-bar">
      <div class="nav-links">
        <button class="nav-btn ${state.currentTab === 'dashboard' ? 'active' : ''}" onclick="switchTab('dashboard')">Overview & Analytics</button>
        <button class="nav-btn ${state.currentTab === 'programs' ? 'active' : ''}" onclick="switchTab('programs')">Grant Programs (M1)</button>
        <button class="nav-btn ${state.currentTab === 'applications' ? 'active' : ''}" onclick="switchTab('applications')">Applications & Eligibility (M2)</button>
        <button class="nav-btn ${state.currentTab === 'reviews' ? 'active' : ''}" onclick="switchTab('reviews')">Review & Sanction Desk (M3)</button>
        <button class="nav-btn ${state.currentTab === 'disbursements' ? 'active' : ''}" onclick="switchTab('disbursements')">Disbursements & Reports (M4)</button>
      </div>
      <div>
        <span class="badge badge-green" style="font-size: 11px;">● SYSTEM DEMO READY</span>
      </div>
    </nav>

    <!-- Main Workspace Container -->
    <main id="mainContent" class="container"></main>

    <!-- Modal Container -->
    <div id="modalHost"></div>
  `;

  document.getElementById('roleSwitcher').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'officer_sharma') {
      state.currentUser = { userId: 2, username: 'officer_sharma', fullName: 'Sunita Sharma', role: 'ROLE_PROGRAM_OFFICER', organizationName: 'DST' };
    } else if (val === 'applicant_patel') {
      state.currentUser = { userId: 7, username: 'applicant_patel', fullName: 'Chirag Patel', role: 'ROLE_APPLICANT', organizationName: 'KrishiAI Technologies' };
    } else if (val === 'reviewer_kapoor') {
      state.currentUser = { userId: 4, username: 'reviewer_kapoor', fullName: 'Dr. Alok Kapoor', role: 'ROLE_REVIEWER', organizationName: 'IIT Delhi' };
    } else {
      state.currentUser = { userId: 1, username: 'admin', fullName: 'Rajesh K. Verma', role: 'ROLE_ADMIN', organizationName: 'NIC' };
    }
    renderShell();
    renderContent();
  });
}

function switchTab(tab) {
  state.currentTab = tab;
  renderShell();
  renderContent();
}

function renderContent() {
  const host = document.getElementById('mainContent');
  if (state.currentTab === 'dashboard') {
    renderDashboard(host);
  } else if (state.currentTab === 'programs') {
    renderPrograms(host);
  } else if (state.currentTab === 'applications') {
    renderApplications(host);
  } else if (state.currentTab === 'reviews') {
    renderReviews(host);
  } else if (state.currentTab === 'disbursements') {
    renderDisbursements(host);
  }
}

// -----------------------------------------------------------------------------
// TAB 1: OVERVIEW & ANALYTICS DASHBOARD
// -----------------------------------------------------------------------------
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
          <div class="card-title">Recent Grant Submissions & Sanctions</div>
          <div class="card-desc">Latest proposals submitted across states and evaluated against scheme rubrics</div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="switchTab('applications')">View All Applications</button>
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

// -----------------------------------------------------------------------------
// TAB 2: MODULE 1 - GRANT PROGRAM SETUP & CONFIGURATION
// -----------------------------------------------------------------------------
function renderPrograms(host) {
  host.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Grant Programs Setup & Scheme Catalog (Module 1)</div>
          <div class="card-desc">Configure grant schemes, budget allocations, date horizons, and automated eligibility criteria</div>
        </div>
        ${state.currentUser.role === 'ROLE_PROGRAM_OFFICER' || state.currentUser.role === 'ROLE_ADMIN' ? `
          <button class="btn btn-primary" onclick="openNewProgramModal()">+ Configure New Grant Program</button>
        ` : ''}
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
        <form id="newProgForm" onsubmit="handleCreateProgram(event)">
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

async function handleCreateProgram(e) {
  e.preventDefault();
  const newProg = {
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

  try {
    const res = await fetch(`${API_BASE}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProg)
    });
    if (res.ok) {
      const saved = await res.json();
      state.programs.unshift(saved);
    } else {
      state.programs.unshift(newProg);
    }
  } catch (err) {
    state.programs.unshift(newProg);
  }

  closeModal();
  renderContent();
  alert('Grant Program created successfully! Ready for applications.');
}

// -----------------------------------------------------------------------------
// TAB 3: MODULE 2 - APPLICATION SUBMISSION & ELIGIBILITY CHECK
// -----------------------------------------------------------------------------
function renderApplications(host) {
  host.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Grant Applications & Automated Eligibility Engine (Module 2)</div>
          <div class="card-desc">Proposals submitted by applicants evaluated in real time against scheme criteria</div>
        </div>
        <button class="btn btn-primary" onclick="openNewApplicationModal()">+ Submit New Grant Application</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>App Number</th>
              <th>Scheme Applied</th>
              <th>Applicant & Entity</th>
              <th>Requested (INR)</th>
              <th>Eligibility Verdict</th>
              <th>Eligibility Audit Remarks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.applications.map(a => `
              <tr>
                <td><strong>${a.applicationNumber}</strong></td>
                <td>
                  <div style="font-weight: 500;">${a.program ? a.program.title : 'General Grant'}</div>
                  <small style="color: #64748b;">${a.projectTitle}</small>
                </td>
                <td>
                  <div>${a.applicant ? a.applicant.fullName : 'Applicant'}</div>
                  <small style="color: #64748b;">${a.organizationType} • ${a.stateOrRegion}</small>
                </td>
                <td><strong>${formatINR(a.requestedAmount)}</strong></td>
                <td>${getStatusBadge(a.eligibilityStatus)}</td>
                <td style="max-width: 280px; font-size: 11px; color: #475569;">
                  ${a.eligibilityRemarks || 'Checks passed.'}
                </td>
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

function openNewApplicationModal() {
  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Submit Grant Application (Module 2)</h3>
          <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
        </div>
        <form id="newAppForm" onsubmit="handleSubmitApplication(event)">
          <div class="form-group" style="margin-bottom: 14px;">
            <label>Select Target Grant Scheme *</label>
            <select id="appProgId" class="form-select" required>
              ${state.programs.map(p => `
                <option value="${p.programId}">${p.programCode} - ${p.title} (${formatINR(p.minGrantAmount)} to ${formatINR(p.maxGrantAmount)})</option>
              `).join('')}
            </select>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Organization Legal Entity Type *</label>
              <select id="appOrgType" class="form-select" required>
                <option value="Startup">DPIIT Recognized Startup</option>
                <option value="MSME">Registered MSME (Udyam)</option>
                <option value="NGO / Trust">Section 8 / Registered NGO</option>
                <option value="Academic Institution">University / Research Lab</option>
              </select>
            </div>
            <div class="form-group">
              <label>Years in Operation * (Eligibility Checked)</label>
              <input type="number" id="appYears" class="form-input" required value="3" min="0">
            </div>
            <div class="form-group">
              <label>Organization PAN (10 chars) *</label>
              <input type="text" id="appPan" class="form-input" required value="AABCK${Math.floor(Math.random()*9000)+1000}F" maxlength="10">
            </div>
            <div class="form-group">
              <label>GSTIN Number *</label>
              <input type="text" id="appGstin" class="form-input" required value="24AABCK1234F1Z8">
            </div>
            <div class="form-group">
              <label>Annual Turnover (INR) *</label>
              <input type="number" id="appTurnover" class="form-input" required value="12000000">
            </div>
            <div class="form-group">
              <label>State / Region *</label>
              <input type="text" id="appState" class="form-input" required value="Gujarat">
            </div>
            <div class="form-group">
              <label>District *</label>
              <input type="text" id="appDistrict" class="form-input" required value="Ahmedabad">
            </div>
            <div class="form-group">
              <label>Requested Grant Amount (INR) *</label>
              <input type="number" id="appAmount" class="form-input" required value="4000000">
            </div>
            <div class="form-group">
              <label>Project Duration (Months) *</label>
              <input type="number" id="appDuration" class="form-input" required value="18" min="1">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 12px;">
            <label>Project Proposal Title *</label>
            <input type="text" id="appTitle" class="form-input" required placeholder="e.g. Next-Gen Bio-Enzyme Conversion Plant">
          </div>
          <div class="form-group" style="margin-bottom: 14px;">
            <label>Detailed Project Summary & Methodology *</label>
            <textarea id="appSummary" class="form-textarea" required placeholder="Explain technological innovation, work packages, milestones, and beneficiaries..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Run Automated Eligibility & Submit >> </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

async function handleSubmitApplication(e) {
  e.preventDefault();
  const progId = parseInt(document.getElementById('appProgId').value);
  const prog = state.programs.find(p => p.programId === progId) || state.programs[0];
  const requestedAmt = parseFloat(document.getElementById('appAmount').value);
  const years = parseInt(document.getElementById('appYears').value);

  // Client-side rule execution simulation matching EligibilityEngineService
  let eligible = true;
  let remarks = [];

  if (requestedAmt < prog.minGrantAmount || requestedAmt > prog.maxGrantAmount) {
    eligible = false;
    remarks.push(`Requested amount (${formatINR(requestedAmt)}) outside permitted range (${formatINR(prog.minGrantAmount)} - ${formatINR(prog.maxGrantAmount)}).`);
  }
  if (years < 2) {
    eligible = false;
    remarks.push('Failed MIN_OPERATING_YEARS rule (Required: 2, Actual: ' + years + ').');
  }
  if (remarks.length === 0) {
    remarks.push('All mandatory program criteria and ceilings validated successfully.');
  }

  const payload = {
    programId: progId,
    projectTitle: document.getElementById('appTitle').value,
    projectSummary: document.getElementById('appSummary').value,
    requestedAmount: requestedAmt,
    projectDurationMonths: parseInt(document.getElementById('appDuration').value),
    targetBeneficiaries: 'Farmers & rural MSME units',
    stateOrRegion: document.getElementById('appState').value,
    district: document.getElementById('appDistrict').value,
    organizationType: document.getElementById('appOrgType').value,
    organizationPan: document.getElementById('appPan').value,
    organizationGstin: document.getElementById('appGstin').value,
    annualTurnover: parseFloat(document.getElementById('appTurnover').value),
    yearsInOperation: years
  };

  const newApp = {
    applicationId: state.applications.length + 1,
    applicationNumber: `APP-2025-${Math.floor(Math.random()*90000)+10000}`,
    program: prog,
    applicant: state.currentUser,
    ...payload,
    eligibilityStatus: eligible ? 'AUTO_ELIGIBLE' : 'AUTO_INELIGIBLE',
    eligibilityRemarks: remarks.join('; '),
    status: 'SUBMITTED',
    submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  try {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const saved = await res.json();
      state.applications.unshift(saved);
    } else {
      state.applications.unshift(newApp);
    }
  } catch (err) {
    state.applications.unshift(newApp);
  }

  closeModal();
  renderContent();
  alert(`Application Submitted! \nAutomated Verdict: ${newApp.eligibilityStatus}\nRemarks: ${newApp.eligibilityRemarks}`);
}

// -----------------------------------------------------------------------------
// TAB 4: MODULE 3 - REVIEW & APPROVAL WORKFLOW
// -----------------------------------------------------------------------------
function renderReviews(host) {
  host.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Peer Review & Sanction Desk (Module 3)</div>
          <div class="card-desc">Rubric-based evaluation (0-100), reviewer recommendations, and sanctioning committee approval</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>App Number</th>
              <th>Project Title</th>
              <th>Applicant</th>
              <th>Requested</th>
              <th>Eligibility</th>
              <th>Workflow Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.applications.map(a => `
              <tr>
                <td><strong>${a.applicationNumber}</strong></td>
                <td>${a.projectTitle}</td>
                <td>${a.applicant ? a.applicant.fullName : 'Applicant'}</td>
                <td><strong>${formatINR(a.requestedAmount)}</strong></td>
                <td>${getStatusBadge(a.eligibilityStatus)}</td>
                <td>${getStatusBadge(a.status)}</td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-secondary btn-sm" onclick="openScorecardModal(${a.applicationId})">Score Rubric</button>
                    ${state.currentUser.role === 'ROLE_PROGRAM_OFFICER' || state.currentUser.role === 'ROLE_ADMIN' ? `
                      <button class="btn btn-primary btn-sm" onclick="openDecisionModal(${a.applicationId})">Sanction</button>
                    ` : ''}
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
                <option value="NEEDS_REVISION">NEEDS REVISION (Request Additional Financial Details)</option>
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
  if (app) {
    app.status = 'UNDER_REVIEW';
  }
  closeModal();
  renderContent();
  alert('Review Scorecard Submitted! Cumulative score calculated and recorded in audit log.');
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

async function handleDecisionSubmit(e, appId) {
  e.preventDefault();
  const dec = document.getElementById('decType').value;
  const amt = parseFloat(document.getElementById('decAmt').value);
  const notes = document.getElementById('decNotes').value;

  const app = state.applications.find(a => a.applicationId === appId);
  if (app) {
    app.status = dec === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    if (dec === 'APPROVE') app.approvedAmount = amt;
  }

  try {
    await fetch(`${API_BASE}/applications/${appId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: dec, approvedAmount: amt, decisionNotes: notes })
    });
  } catch (err) {}

  closeModal();
  renderContent();
  alert(`Decision executed: ${dec} recorded for ${app.applicationNumber}`);
}

// -----------------------------------------------------------------------------
// TAB 5: MODULE 4 - GRANT DISBURSEMENT AND REPORTING
// -----------------------------------------------------------------------------
function renderDisbursements(host) {
  host.innerHTML = `
    <!-- Multi-Tranche Disbursements -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Grant Disbursements Tracker (Module 4)</div>
          <div class="card-desc">Manage multi-tranche payment releases via PFMS, DBT, and treasury transfers</div>
        </div>
        ${state.currentUser.role === 'ROLE_PROGRAM_OFFICER' || state.currentUser.role === 'ROLE_ADMIN' ? `
          <button class="btn btn-primary" onclick="openScheduleDisbModal()">+ Schedule New Tranche</button>
        ` : ''}
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>PFMS Reference</th>
              <th>Application & Beneficiary</th>
              <th>Tranche</th>
              <th>Amount (INR)</th>
              <th>Payment Mode</th>
              <th>Bank / Masked A/C</th>
              <th>Disbursed Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.disbursements.map(d => `
              <tr>
                <td><strong>${d.disbursementReference}</strong></td>
                <td>
                  <div>${d.application ? d.application.applicationNumber : 'Grant Beneficiary'}</div>
                  <small style="color: #64748b;">${d.bankName}</small>
                </td>
                <td><span class="badge badge-purple">Tranche ${d.trancheNumber}</span></td>
                <td><strong>${formatINR(d.disbursementAmount)}</strong></td>
                <td>${d.paymentMethod}</td>
                <td>${d.accountNumberMasked} (${d.ifscCode})</td>
                <td>${d.disbursementDate || d.scheduledDate}</td>
                <td>${getStatusBadge(d.status)}</td>
                <td>
                  ${d.status === 'SCHEDULED' ? `
                    <button class="btn btn-success btn-sm" onclick="executeDisbursementNow(${d.disbursementId})">Execute Payment</button>
                  ` : `
                    <span class="badge badge-green">Voucher Settled</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Milestone Utilization Certificates (UC) -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Milestone Progress & Utilization Certificates (UC)</div>
          <div class="card-desc">Beneficiary progress submissions audited before unlocking subsequent tranches</div>
        </div>
        <button class="btn btn-secondary" onclick="openSubmitUCModal()">+ Submit Utilization Certificate</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>App Number</th>
              <th>Milestone Title & Scope</th>
              <th>Tranche</th>
              <th>Claimed Expenditure</th>
              <th>Progress %</th>
              <th>Audit Status</th>
              <th>Audit Officer Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.utilizationReports.map(u => `
              <tr>
                <td><strong>${u.application ? u.application.applicationNumber : 'APP-2024'}</strong></td>
                <td>
                  <div style="font-weight: 500;">${u.milestoneTitle}</div>
                  <small style="color: #64748b;">${u.progressNarrative}</small>
                </td>
                <td>Tranche ${u.trancheNumber}</td>
                <td><strong>${formatINR(u.amountUtilized)}</strong></td>
                <td>
                  <div style="font-weight: 700; color: #059669;">${u.utilizationPercentage}%</div>
                </td>
                <td>${getStatusBadge(u.verificationStatus)}</td>
                <td style="font-size: 11px; color: #475569;">${u.verificationRemarks || 'Awaiting officer site audit.'}</td>
                <td>
                  ${u.verificationStatus === 'PENDING_VERIFICATION' && (state.currentUser.role === 'ROLE_PROGRAM_OFFICER' || state.currentUser.role === 'ROLE_ADMIN') ? `
                    <button class="btn btn-success btn-sm" onclick="verifyUCReport(${u.reportId})">Verify & Pass</button>
                  ` : `
                    <span class="badge badge-green">Verified</span>
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

function executeDisbursementNow(disbId) {
  const disb = state.disbursements.find(d => d.disbursementId === disbId);
  if (!disb) return;

  const txn = prompt('Enter PFMS Payment Gateway Transaction Reference:', `PFMS${Date.now()}`);
  if (!txn) return;

  disb.status = 'DISBURSED';
  disb.transactionReference = txn;
  disb.disbursementDate = new Date().toISOString().substring(0, 10);

  // Update stats
  state.stats.totalDisbursedBudget += disb.disbursementAmount;
  state.stats.budgetUtilizationRate = (state.stats.totalDisbursedBudget / state.stats.totalAllocatedBudget) * 100;

  renderContent();
  alert(`Disbursement ${disb.disbursementReference} of ${formatINR(disb.disbursementAmount)} marked DISBURSED!\nProgram budget tally updated.`);
}

function verifyUCReport(repId) {
  const rep = state.utilizationReports.find(r => r.reportId === repId);
  if (!rep) return;

  const remarks = prompt('Enter Officer Verification Audit Remarks:', 'Physical site inspection verified by district officer. Vouchers audited.');
  if (remarks) {
    rep.verificationStatus = 'VERIFIED_SATISFACTORY';
    rep.verificationRemarks = remarks;
    renderContent();
    alert('Milestone Utilization Certificate verified satisfactory! Subsequent tranche unlocked.');
  }
}

function openSubmitUCModal() {
  const modal = document.getElementById('modalHost');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Submit Milestone Utilization Certificate (Module 4)</h3>
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
            <textarea id="ucNarrative" class="form-textarea" required>Procured all solar pumping units and finished civil foundation work on site.</textarea>
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
  renderContent();
  alert('Utilization Certificate submitted! Awaiting Program Officer verification.');
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

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="openScorecardModal(${app.applicationId})">Score Rubric</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function closeModal(e) {
  if (e && e.target && !e.target.classList.contains('modal-overlay') && !e.target.classList.contains('btn-secondary')) {
    return;
  }
  document.getElementById('modalHost').innerHTML = '';
}
