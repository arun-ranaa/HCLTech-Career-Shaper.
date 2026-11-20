srs_path = r"c:\Users\arunj\OneDrive\Desktop\grants\docs\SRS.md"

with open(srs_path, "r", encoding="utf-8") as f:
    text = f.read()

# Update Table of Contents
old_toc_s6 = """  - [6.1 Use Case Model and Actor Interaction](#61-use-case-model-and-actor-interaction)
  - [6.2 Data Flow Diagram (DFD Level 0 Context Diagram)](#62-data-flow-diagram-dfd-level-0-context-diagram)
  - [6.3 Entity-Relationship Model (3NF Relational Architecture)](#63-entity-relationship-model-3nf-relational-architecture)
- [7. Academic Review & Sign-Off](#7-academic-review--sign-off)"""

new_toc_s6 = """  - [6.1 Use Case Model and Actor Interaction](#61-use-case-model-and-actor-interaction)
  - [6.2 Data Flow Diagram (DFD Level 0 Context Diagram)](#62-data-flow-diagram-dfd-level-0-context-diagram)
  - [6.3 Entity-Relationship Model (3NF Relational Architecture)](#63-entity-relationship-model-3nf-relational-architecture)
  - [6.4 Activity and UML Sequence Model (Happy-Path & Error Recovery)](#64-activity-and-uml-sequence-model-happy-path--error-recovery)
- [7. Academic Review & Sign-Off](#7-academic-review--sign-off)"""

text = text.replace(old_toc_s6, new_toc_s6)

# Section 6.4 content
sec64 = """### 6.4 Activity and UML Sequence Model (Happy-Path & Error Recovery)

The UML Sequence Diagram models the chronological message exchange between the presentation tier (Angular 14 UI), REST Controller, service/algorithmic eligibility engine, Oracle 21c XE database tier, committee peer reviewer, and external PFMS banking gateway:

![UML Sequence Diagram](images/sequence_diagram.png)

#### Chronological Flow & Decision Branching:
1. **Phase 1 (Proposal Submission)**: The Applicant submits project credentials via the Angular wizard; client validation asserts PAN, GSTIN, and budget boundaries before dispatching an authenticated Bearer JWT request to `ApplicationController`.
2. **Phase 2 (Automated Algorithmic Eligibility Check)**: `EligibilityEngineService` executes rule comparisons against configured scheme criteria:
   - *Error Recovery Branch*: Breaches (e.g. Operating Age < 2 Years) trigger `AUTO_INELIGIBLE`, return HTTP 422, and display remediation guidelines to the applicant.
   - *Happy-Path Branch*: Full compliance marks `AUTO_ELIGIBLE`, generates application tracking number `APP-2024-AGRI-00101`, returns HTTP 201 Created, and unlocks stage tracking.
3. **Phase 3 (Peer Review Scoring & Auto-Approval)**: The Program Officer assigns the proposal to a committee reviewer (`UNDER_REVIEW`). The Reviewer submits a 4-slider rubric scorecard (Feasibility, Innovation, Budget Realism, Social Impact: 0–100 scale). The engine recalculates the score (90/100), **automatically updates the application record status to `APPROVED`**, and records an immutable audit log (`REVIEW_APPROVED`).
4. **Phase 4 (Sanction Order & PFMS Multi-Tranche Disbursement)**: The Officer issues Sanction Order `SAN-2024-DST-098` and authorizes Tranche 1 (INR 2,250,000):
   - *Banking Error Recovery*: Bank gateway timeout (HTTP 504) or account mismatch records `DISBURSEMENT_FAILED` and alerts the Officer.
   - *Banking Happy-Path*: Payment settles electronically via Reserve Bank of India PFMS network, issuing UTR `UTR-2024-PFMS-988214`, atomically updating tranche status to `DISBURSED`, debiting scheme budget, and generating payment advice.
5. **Phase 5 (Milestone UC Compliance)**: The Applicant submits field expenditure and certified Utilization Certificate (UC). The Officer verifies the report (`VERIFIED_SATISFACTORY`), unlocking subsequent tranches.

---

"""

# Insert before Section 7
old_s7 = "## 7. Academic Review & Sign-Off"
text = text.replace(old_s7, sec64 + old_s7)

with open(srs_path, "w", encoding="utf-8") as f:
    f.write(text)

print("SUCCESS: docs/SRS.md successfully extended with Section 6.4 and Sequence Diagram!")
