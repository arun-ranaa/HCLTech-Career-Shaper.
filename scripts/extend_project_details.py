import os

sec10_content = """---

## 10. System Analysis Models: Activity & UML Sequence Diagram

### 10.1 Model Objective & Overview
The **UML Sequence Diagram** models the dynamic behavioral interactions, chronological message exchanges, transactional boundaries, and decision branching across all tiers of the Grants Management System (GMS - J18):
1. **Grant Applicant / Citizen Tier** (Client browser interactions)
2. **Angular 14 SPA Presentation Tier** (Input capture, form validation, live status rendering)
3. **Spring Boot REST Controller Tier** (`/api/v1/*` stateless API routing & JWT authentication)
4. **Business Logic & Workflow Engine Tier** (`EligibilityEngineService`, `ReviewWorkflowService`, `@Transactional` services)
5. **Oracle 21c XE / JPA Database Tier** (3NF normalized persistent storage & immutable audit logging)
6. **Technical Evaluation Committee Tier** (Peer reviewer assigned queue & 4-slider rubric scoring)
7. **PFMS Banking Gateway Tier** (External Public Financial Management System / Direct Benefit Transfer)

The sequence diagram details both the **Happy-Path** (successful eligibility, peer approval, and electronic settlement) and **Error Recovery** paths (eligibility threshold failures and banking network timeouts).

---

### 10.2 High-Resolution Sequence Diagram

![UML Sequence Diagram](docs/images/sequence_diagram.png)

*Figure 10.1: UML Sequence Diagram - Grants Management System (GMS - J18) detailing Chronological Message Flow, Automated Eligibility Evaluation, Reviewer Scoring Rubric, PFMS Disbursement & Error Recovery Branches.*

---

### 10.3 Mermaid Dynamic Sequence Specification

```mermaid
sequenceDiagram
    autonumber
    actor Applicant as Grant Applicant
    participant UI as Angular 14 SPA
    participant CTL as Spring Boot Controller
    participant SRV as Eligibility & Service Tier
    participant DB as Oracle 21c XE / JPA
    actor Reviewer as Committee Reviewer
    participant Bank as PFMS Bank Gateway

    %% Phase 1: Submission
    rect rgb(240, 249, 255)
    Note over Applicant, DB: Phase 1: Grant Proposal Submission & Validation (Module 2)
    Applicant->>UI: submitProposal(title, requestedBudget, age, turnover, PAN, bankDetails)
    UI->>UI: validateClientForm(PAN:10chars, GSTIN:15chars, budgetLimits)
    UI->>CTL: POST /api/v1/applications [Authorization: Bearer <JWT>]
    CTL->>SRV: createApplication(ApplicationRequestDTO, authPrincipal)
    SRV->>DB: saveApplicationRecord(status = 'SUBMITTED')
    DB-->>SRV: Return saved ApplicationEntity (ID: 101, Status: SUBMITTED)
    end

    %% Phase 2: Automated Eligibility Engine
    rect rgb(245, 243, 255)
    Note over SRV, DB: Phase 2: Automated Algorithmic Eligibility Engine (Module 2)
    SRV->>DB: findCriteriaByProgramId(programId)
    DB-->>SRV: Return Set<ProgramEligibilityCriterion>
    SRV->>SRV: executeEligibilityRules(applicantMetrics, criteriaList)

    alt Threshold Breach (Error Recovery Path)
        SRV->>DB: updateEligibilityStatus('AUTO_INELIGIBLE', failureRemarks)
        CTL-->>UI: HTTP 422 Unprocessable Entity (AUTO_INELIGIBLE)
        UI-->>Applicant: Render Ineligibility Warning & Policy Remediation Notice
    else All Mandatory Rules Satisfied (Happy Path)
        SRV->>DB: updateEligibilityStatus('AUTO_ELIGIBLE', 'All criteria satisfied')
        CTL-->>UI: HTTP 201 Created (ApplicationNumber, AUTO_ELIGIBLE)
        UI-->>Applicant: Render Live Compliance Badge (Green) & Active Tracker
    end
    end

    %% Phase 3: Reviewer Scoring
    rect rgb(236, 253, 245)
    Note over UI, Reviewer: Phase 3: Reviewer Assignment & 4-Slider Rubric Scoring (Module 3)
    UI->>CTL: POST /api/v1/applications/101/assign-reviewer {reviewerId: 4}
    CTL->>SRV: assignReviewer(appId = 101, reviewerId = 4)
    SRV->>DB: createReviewAssignment & updateStatus('UNDER_REVIEW')
    Reviewer->>UI: GET /reviews/reviewer/4 (Inspects proposal dossier & attachments)
    Reviewer->>UI: submitScorecard(Feasibility:23, Innovation:22, Budget:21, Social:24, Rec: RECOMMEND_APPROVE)
    UI->>CTL: POST /api/v1/reviews/401/submit {rubricScores, comments, recommendation}
    CTL->>SRV: submitReview(reviewId, SubmitReviewRequestDTO)
    SRV->>SRV: recalculateTotal(Score: 90/100) & evaluateRecommendation()
    SRV->>DB: updateApplicationStatus('APPROVED') & setApprovedAmount(4500000)
    SRV->>DB: insertApprovalWorkflowLog('UNDER_REVIEW' -> 'APPROVED', 'REVIEW_APPROVED', 90/100)
    CTL-->>UI: HTTP 200 OK (Status: APPROVED, Score: 90/100)
    UI-->>Applicant: Real-time Notification: Proposal APPROVED by Technical Committee
    end

    %% Phase 4: Disbursement & Banking ALT
    rect rgb(255, 241, 242)
    Note over UI, Bank: Phase 4: Sanction Order & Multi-Tranche PFMS Electronic Disbursement (Module 4)
    UI->>CTL: POST /api/v1/applications/101/decision {decision: 'APPROVE', sanctionOrder: 'SAN-2024-DST-098'}
    UI->>CTL: POST /api/v1/disbursements/501/execute [Officer authorizes Tranche 1: INR 2,250,000]
    CTL->>SRV: executeDisbursementTranche(disbursementId = 501)
    SRV->>Bank: POST /pfms/api/direct-benefit-transfer {amount: 2250000, accNo: '****5678', ifsc: 'SBIN0001234'}

    alt PFMS Gateway Timeout / Bank Validation Failure (Error Recovery Path)
        Bank-->>SRV: HTTP 504 Gateway Timeout / Payment Rejected (NPCI Reason Code: AC04)
        SRV->>DB: updateDisbursementStatus('FAILED') & recordPaymentAudit('GATEWAY_TIMEOUT')
        CTL-->>UI: HTTP 502 Bad Gateway {error: 'PFMS Transfer Failed', action: 'Verify IFSC or Retry'}
    else Electronic Fund Transfer Settled (Happy Path)
        Bank-->>SRV: HTTP 200 OK {status: 'SUCCESS', utr: 'UTR-2024-PFMS-988214'}
        SRV->>DB: @Transactional: updateDisbursement('DISBURSED', utr) & debitSchemeBudget(2250000)
        CTL-->>UI: HTTP 200 OK {disbursementStatus: 'DISBURSED', utrNumber: 'UTR-2024-PFMS-988214'}
        UI-->>Applicant: Render Payment Sanction Advice (PDF Download) & Unlock Tranche 2 Milestone UC Form
    end
    end

    %% Phase 5: Milestone UC Compliance
    rect rgb(254, 252, 232)
    Note over Applicant, DB: Phase 5: Milestone Utilization Certificate (UC) & Subsequent Tranches (Module 4)
    Applicant->>UI: submitMilestoneUC(Tranche:1, Expenditure:2100000, Progress:50%, uc_document.pdf)
    UI->>CTL: POST /api/v1/utilization-reports [Applicant submits certified UC document]
    CTL->>SRV: createUtilizationReport(dto, ucFile)
    SRV->>DB: saveUtilizationReport(status = 'SUBMITTED') & logMilestoneAudit()
    UI->>CTL: POST /api/v1/utilization-reports/801/verify {status: 'VERIFIED_SATISFACTORY'}
    CTL->>DB: updateUCStatus('VERIFIED_SATISFACTORY') & unlockTranche2Disbursement()
    end
```

---

### 10.4 Detailed Chronological Message & Phase Walkthrough

#### Phase 1: Grant Proposal Submission & Client Pre-flight Validation
* **Message 1 (`submitProposal`)**: The Grant Applicant fills out the multi-step proposal form in the Angular 14 client, entering organization credentials, turnover, operating age, target beneficiaries, requested grant funding, and beneficiary bank account details.
* **Message 2 (`validateClientForm`)**: Angular reactive forms enforce instant client-side validation: 10-character alphanumeric PAN regex (`[A-Z]{5}[0-9]{4}[A-Z]{1}`), 15-character GSTIN regex, and proposal amount bounds (must fall within the scheme's configured `minGrantAmount` and `maxGrantAmount`).
* **Message 3 (`POST /api/v1/applications`)**: Dispatches a secure HTTPS payload with the user's RFC 7519 Bearer JWT token in the `Authorization` header.
* **Message 4–6 (`createApplication` & persistence)**: Spring MVC extracts the authenticated principal, maps the JSON payload to `ApplicationRequestDTO`, creates the entity with initial status `SUBMITTED`, and persists the transaction in the Oracle database.

#### Phase 2: Automated Algorithmic Eligibility Engine Execution
* **Message 7–9 (`findCriteriaByProgramId` & rule execution)**: `EligibilityEngineService` retrieves the active eligibility criteria associated with the grant program and executes automated comparison algorithms:
  - *Numeric Minimum Checks*: Compares Applicant Operating Age against `MIN_OPERATING_YEARS`.
  - *Numeric Maximum Checks*: Compares Applicant Annual Turnover against `MAX_ANNUAL_TURNOVER`.
  - *Entity Type Inclusion*: Validates whether Applicant entity type (`Startup`, `NGO`, `MSME`) is in the allowed set.
  - *Mandatory Flag Checks*: Asserts presence of required corporate credentials.
* **Alternative Frame 1 [ALT: Eligibility Assessment]**:
  - **Error Recovery Path (Branch 10a–12a)**: If any mandatory rule fails, the engine sets `eligibilityStatus = 'AUTO_INELIGIBLE'`, records detailed failure remarks (e.g., *"Operating age 1 yr is below required minimum of 2 yrs"*), returns HTTP 422 Unprocessable Entity, and renders an actionable remediation banner on the applicant portal.
  - **Happy Path (Branch 10b–12b)**: If all mandatory criteria are met, the engine transitions status to `AUTO_ELIGIBLE`, issues an official application tracking number (`APP-2024-AGRI-00101`), returns HTTP 201 Created, and unlocks the real-time application tracker.

#### Phase 3: Reviewer Assignment, 4-Slider Rubric Scoring & Auto-Approval
* **Message 13–15 (`assignReviewer`)**: The Program Officer inspects eligible applications and assigns a technical committee member (e.g. *Dr. Alok Kapoor, Professor, IIT Delhi*), transitioning status to `UNDER_REVIEW`.
* **Message 16 (`GET /reviews/reviewer/{id}`)**: The Reviewer signs into their dedicated portal and inspects assigned proposal dossiers, financial asks, and technical attachments.
* **Message 17–19 (`submitScorecard`)**: The Reviewer appraises the proposal using four standardized rubric sliders (Feasibility: 0–25, Innovation: 0–25, Budget Realism: 0–25, Social Impact: 0–25), selects a recommendation (`RECOMMEND_APPROVE`), and provides qualitative comments.
* **Message 20–22 (`recalculateTotal` & Auto-Approval Updation)**: `ReviewWorkflowService` validates scores, computes the cumulative score (e.g. 90/100), and **automatically updates the application record status to `APPROVED`** in both the Oracle database and synchronized local storage. It logs an immutable event (`REVIEW_APPROVED`) in `APPROVAL_WORKFLOW_LOGS`.
* **Message 23–24 (`HTTP 200 OK`)**: Emits immediate real-time notifications to the Program Officer that the proposal is officially approved and ready for sanction order generation.

#### Phase 4: Sanction Order & Multi-Tranche PFMS Electronic Disbursement
* **Message 25–27 (`decision` & `executeDisbursementTranche`)**: The Program Officer issues formal Sanction Order `SAN-2024-DST-098`, divides approved funds into milestone tranches, and triggers release of Tranche 1 (INR 2,250,000).
* **Message 28 (`POST /pfms/api/direct-benefit-transfer`)**: The service dispatches an electronic payment order to the simulated Public Financial Management System (PFMS) / Core Banking gateway.
* **Alternative Frame 2 [ALT: Banking Network Settlement Channel]**:
  - **Error Recovery Path (Branch 29a–31a)**: If the PFMS banking gateway encounters an HTTP 504 Timeout or rejects the transfer due to an invalid IFSC/frozen account (`NPCI Reason Code: AC04`), the service marks the tranche as `DISBURSEMENT_FAILED`, logs the failure in `AUDIT_LOGS`, returns HTTP 502 Bad Gateway, and prompts the officer to verify bank details or trigger an automated retry.
  - **Happy Path (Branch 29b–32b)**: Upon successful electronic fund settlement via the Reserve Bank of India PFMS network, the bank returns HTTP 200 with a Unique Transaction Reference (`UTR-2024-PFMS-988214`). In a single `@Transactional` ACID boundary, the system marks the tranche as `DISBURSED`, writes the UTR, debits the scheme's allocated budget counter, generates a downloadable Sanction Advice PDF, and unlocks the Milestone Utilization Certificate submission form for the next tranche.

#### Phase 5: Milestone Utilization Certificate (UC) Compliance & Subsequent Tranches
* **Message 33–36 (`submitMilestoneUC`)**: The beneficiary logs field expenditure incurred (INR 2,100,000), milestone completion progress (50%), and uploads a certified Utilization Certificate document (`uc_document.pdf`).
* **Message 37–38 (`verifyUC`)**: The Program Officer inspects the audited UC document and certifies compliance (`VERIFIED_SATISFACTORY`). The system verifies that the previous tranche has been legitimately spent and automatically unlocks Tranche 2 for scheduling and disbursement.

---

*End of Project Technical Dossier.*
"""

# Read original PROJECT_DETAILS.md
proj_path = r"c:\Users\arunj\OneDrive\Desktop\grants\PROJECT_DETAILS.md"
with open(proj_path, "r", encoding="utf-8") as f:
    text = f.read()

# Update Section 9 table to include Sequence Diagram
old_s9_table = "| **3NF Relational ERD** | [docs/images/erd_diagram.png](file:///c:/Users/arunj/OneDrive/Desktop/grants/docs/images/erd_diagram.png) | Normalized Third Normal Form database schema architecture. |"
new_s9_table = """| **3NF Relational ERD** | [docs/images/erd_diagram.png](file:///c:/Users/arunj/OneDrive/Desktop/grants/docs/images/erd_diagram.png) | Normalized Third Normal Form database schema architecture. |
| **UML Sequence Diagram** | [docs/images/sequence_diagram.png](file:///c:/Users/arunj/OneDrive/Desktop/grants/docs/images/sequence_diagram.png) | Chronological sequence of messages between UI, Controller, Service, and DB for core feature detailing happy-path and error recovery. |"""

text = text.replace(old_s9_table, new_s9_table)

# Replace the end line with Section 10
old_end = "*End of Project Technical Dossier.*"
if old_end in text:
    text = text.replace(old_end, sec10_content)
else:
    text = text + "\n\n" + sec10_content

# Write to root PROJECT_DETAILS.md
with open(proj_path, "w", encoding="utf-8") as f:
    f.write(text)

# Write to docs/PROJECT_DETAILS.md
docs_path = r"c:\Users\arunj\OneDrive\Desktop\grants\docs\PROJECT_DETAILS.md"
with open(docs_path, "w", encoding="utf-8") as f:
    f.write(text)

print("SUCCESS: Both PROJECT_DETAILS.md files successfully extended with Section 10 and UML Sequence Diagram!")
