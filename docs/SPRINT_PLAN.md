# J18 | Grants Management System - Agile Sprint Plan & Release Tags

## 1. Sprint Architecture & Timeline (Total Duration: 90 Hours)

```
[Sprint 0: 6 Hours] ──> Tag: v0.1.0 (Architecture, Database 3NF, ER Model, Wireframes, Skeletons)
        │
        ▼
[Sprint 1: 28 Hours] ──> Tag: v0.2.0 (Module 1: Program Setup & Criteria Config, Module 2: Submission Engine)
        │
        ▼
[Sprint 2: 28 Hours] ──> Tag: v0.3.0 (Module 3: Reviewer Rubric Scoring & Sanction Workflow Desk)
        │
        ▼
[Sprint 3: 28 Hours] ──> Tag: v1.0.0 (Module 4: Disbursement via PFMS, Milestone UC Audits, Analytics Dashboard, Final Release)
```

---

## 2. Sprint Breakdown

### Sprint 0 (6 Hours) - Foundation, Database Schema & Project Skeletons
- **Deliverables**:
  - Git repository structure with `backend/`, `frontend/`, `database/`, `docs/`, `.gitignore`, `README.md`.
  - Normalized 3NF Oracle 21c XE DDL (`database/schema.sql`) and sample dataset (`database/seed_data.sql`, CSV files).
  - ER diagram and architectural data flow documentation.
  - Initial Spring Boot 3 skeleton and Angular component structure.
- **Sprint Tag**: `v0.1.0`

### Sprint 1 (28 Hours) - Module 1 & Module 2 Implementation
- **Deliverables**:
  - **Module 1**: Grant Program Setup & Configuration (Entities, DTOs, Repositories, Services, REST Controllers).
  - Program eligibility rule definition and weighting matrix.
  - **Module 2**: Application submission portal with multi-step proposal submission.
  - Automated Eligibility Evaluation Engine executing against configured criteria.
  - Unit tests for program creation and eligibility rule validation.
- **Sprint Tag**: `v0.2.0`

### Sprint 2 (28 Hours) - Module 3 Implementation & Integration
- **Deliverables**:
  - **Module 3**: Evaluation Committee & Reviewer workflow.
  - Multi-dimensional scorecard evaluation (Feasibility, Innovation, Budget, Impact).
  - Committee sanctioning portal with approval/rejection decision notes.
  - Complete immutable workflow audit trail logging all state transitions.
  - Integration tests for review submissions and committee approvals.
- **Sprint Tag**: `v0.3.0`

### Sprint 3 (28 Hours) - Module 4, Analytics, Final Hardening & Delivery
- **Deliverables**:
  - **Module 4**: Multi-tranche disbursement scheduler and execution engine with PFMS transaction references.
  - Milestone Utilization Report submission with percentage completion and progress narrative.
  - Officer Utilization Certificate verification desk.
  - Executive KPI analytics dashboard (total funds, disbursed funds, utilization rates, status breakdowns).
  - End-to-end regression testing, comprehensive test report, and production build verification.
- **Final Release Tag**: `v1.0.0`
