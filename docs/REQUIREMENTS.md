# J18 | Grants Management System - Requirements & Specifications

## 1. Executive Summary & Problem Statement
In public sector governance and grant-making bodies (e.g., Department of Science and Technology, Ministry of Agriculture, Ministry of MSME), grant distribution often suffers from opaque tracking, manual paper-based eligibility checks, delayed review committee evaluations, and disconnected disbursement reconciliation. 

The **Grants Management System (GMS)** provides an end-to-end digital lifecycle:
1. **Grant Program Setup & Configuration**: Structured program creation, budgeting, date horizons, and customizable automated eligibility criteria.
2. **Application Submission & Eligibility Check**: Multi-step intuitive submission portal for applicants with automated rule engines validating criteria (years of operation, entity type, turnover, mandatory registrations) instantly.
3. **Review & Approval Workflow**: Multi-criteria weighted rubrics for expert evaluators (Feasibility, Innovation, Budget Realism, Social Impact), combined with committee sanction workflows.
4. **Grant Disbursement & Reporting**: Tranche management, milestone-linked release via PFMS/DBT/RTGS, beneficiary utilization certificate tracking, audit trails, and financial analytics.

---

## 2. Stakeholders & User Roles

| Role | Role Code | Responsibilities |
| :--- | :--- | :--- |
| **System Administrator** | `ROLE_ADMIN` | Platform configuration, role-based access management, global audit review, system health. |
| **Program Officer** | `ROLE_PROGRAM_OFFICER` | Design and launch grant schemes, set eligibility rules, trigger automated eligibility checks, assign proposals to reviewers, sanction approved grants, schedule and record disbursements. |
| **Evaluation Committee / Reviewer** | `ROLE_REVIEWER` | Review assigned applications, assess project proposals and attachments, submit rubric scores (0-100) and recommendation notes. |
| **Grant Applicant** | `ROLE_APPLICANT` | Explore open grant programs, submit detailed proposals, upload compliance documents, track application progress in real-time, submit milestone utilization reports. |

---

## 3. Epics and User Stories

### Module 1: Grant Program Setup and Configuration
- **EP01-US01 (Program Creation)**: As a Program Officer, I want to create a new grant program with title, funding agency, category, budget allocation, grant range, and active dates, so that applicants can discover and apply for it.
- **EP01-US02 (Eligibility Rule Definition)**: As a Program Officer, I want to configure eligibility criteria (numeric thresholds, allowed entity types, mandatory flags, weights) for a program, so that submissions can be evaluated consistently.
- **EP01-US03 (Program Lifecycle Management)**: As a Program Officer, I want to update program status (`DRAFT`, `ACTIVE`, `UNDER_EVALUATION`, `CLOSED`) and view allocated vs remaining budget.

### Module 2: Application Submission and Eligibility Check
- **EP02-US01 (Program Discovery & Guidelines)**: As an Applicant, I want to browse active grant programs, filter by category/agency, and inspect eligibility requirements before applying.
- **EP02-US02 (Proposal Submission Form)**: As an Applicant, I want to fill in my organization credentials (PAN, GSTIN, turnover, operating age) and project details (title, summary, requested budget, duration, target beneficiaries) and attach proposal documents.
- **EP02-US03 (Automated Eligibility Evaluation Engine)**: As the System, when an application is submitted, I want to execute the program's configured rules against applicant metrics and mark eligibility status (`AUTO_ELIGIBLE` / `AUTO_INELIGIBLE`) with detailed failure remarks.
- **EP02-US04 (Officer Eligibility Override)**: As a Program Officer, I want to review flagged applications and manually override or verify eligibility with audit justification notes.

### Module 3: Review and Approval Workflow
- **EP03-US01 (Reviewer Assignment)**: As a Program Officer, I want to assign eligible applications to technical peer reviewers from the evaluation panel.
- **EP03-US02 (Rubric-based Scoring)**: As a Reviewer, I want to score assigned proposals across four standardized dimensions: Feasibility (25), Innovation (25), Budget Realism (25), and Social Impact (25), along with a final recommendation.
- **EP03-US03 (Sanction Committee Decision)**: As a Program Officer, I want to view all review scores and comments, decide the final approved grant amount, and transition status to `APPROVED` or `REJECTED`.
- **EP03-US04 (Workflow Audit Log)**: As an Auditor or Officer, I want to see the complete immutable event history of all status changes, reviewer actions, and remarks for every application.

### Module 4: Grant Disbursement and Reporting
- **EP04-US01 (Disbursement Tranche Schedule)**: As a Program Officer, I want to schedule multi-tranche disbursements for approved grants specifying tranche number, amount, scheduled date, and beneficiary bank details.
- **EP04-US02 (Disbursement Execution)**: As a Program Officer, I want to execute payments (recording PFMS reference number, payment mode, transaction date) and update the program's disbursed budget counter.
- **EP04-US03 (Milestone Utilization Reporting)**: As an Applicant, I want to submit milestone progress narratives, expenditure utilization certificates (UC), and completion percentages before subsequent tranches are unlocked.
- **EP04-US04 (Officer UC Verification)**: As a Program Officer, I want to inspect and verify submitted utilization reports (`VERIFIED_SATISFACTORY` or `AUDIT_FLAGGED`) before authorizing subsequent tranches.
- **EP04-US05 (Executive Analytics Dashboard)**: As an Officer or Admin, I want an interactive dashboard displaying total schemes, total sanctioned funds, total disbursed amounts, application status breakdown, and sectoral allocation.

---

## 4. Definition of Done (DoD)
1. **Source Code**: Normalized database schema, Spring Boot 3 REST backend, and responsive Angular frontend matching enterprise UX guidelines.
2. **Acceptance Criteria**: All 4 modules tested with positive, negative, and edge-case test vectors.
3. **Automated Tests**: JUnit test suite passing with assertions verifying business rules, eligibility calculations, and controller endpoints.
4. **Git Repository Quality**: Clean git history, proper commit conventions (`feat`, `fix`, `docs`, `test`, `refactor`), branch isolation, and sprint release tags (`v0.1.0`, `v0.2.0`, `v0.3.0`, `v1.0.0`).
5. **Documentation**: Complete architectural guides, API schema, database scripts, test execution report, and setup instructions.
