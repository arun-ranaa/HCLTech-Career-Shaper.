# J18 | Grants Management System - Test Plan & Execution Report

## 1. Test Strategy & Scope
Testing encompasses all functional modules, business logic calculations, automated eligibility engines, role-based access checks, edge-case validations, and end-to-end integration flows.

### Testing Levels
1. **Unit Testing**: JUnit 5 + Mockito for Services, Repositories, Rule Engines, and DTO mappers.
2. **Integration Testing**: Spring Boot Test (`@SpringBootTest`, `@AutoConfigureMockMvc`) testing REST API endpoints against an in-memory database.
3. **Validation & Edge Case Testing**: Testing boundary values, null inputs, malformed criteria, duplicate codes, and maximum-length payloads.
4. **End-to-End User Journeys**: Program setup -> Application submission -> Eligibility computation -> Review rubric scoring -> Sanction approval -> Disbursement execution -> Milestone reporting.

---

## 2. Test Cases and Results Matrix

| Test ID | Module | Scenario | Input / Precondition | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-MOD1-01** | Program Setup | Create Program with valid budget & dates | Budget: INR 5 Cr, Start < End | Program persisted with `ACTIVE` status and unique code | PASS |
| **TC-MOD1-02** | Program Setup | Negative Budget Validation | Budget: -50,000 | Validation exception (`totalBudget must be > 0`) | PASS |
| **TC-MOD1-03** | Program Setup | Date range mismatch | End date before Start date | Constraint violation (`end_date >= start_date`) | PASS |
| **TC-MOD2-01** | Application Submission | Valid submission meeting all criteria | Org age: 3 yrs, Requested: 45L | Application status `SUBMITTED`, eligibility `AUTO_ELIGIBLE` | PASS |
| **TC-MOD2-02** | Eligibility Engine | Entity fails operational age threshold | Org age: 0 yrs (Required: 2) | Eligibility marked `AUTO_INELIGIBLE` with descriptive remark | PASS |
| **TC-MOD2-03** | Eligibility Engine | Requested amount exceeds program maximum | Requested: 1 Crore (Max: 75L) | Application flagged with rule violation | PASS |
| **TC-MOD2-04** | Application Submission | Edge Case: Boundary minimum grant amount | Requested: Exactly 10 Lakhs | Allowed, eligibility validated successfully | PASS |
| **TC-MOD3-01** | Review Workflow | Assign Reviewer to proposal | Eligible application | Review record created with status `ASSIGNED` | PASS |
| **TC-MOD3-02** | Review Workflow | Scorecard rubric computation | 23 + 21 + 22 + 24 | Total score auto-calculated as 90/100 | PASS |
| **TC-MOD3-03** | Review Workflow | Invalid score out of range (0-25) | Feasibility score = 30 | Validation error (`score must be between 0 and 25`) | PASS |
| **TC-MOD3-04** | Sanction Approval | Officer approves application | Decision: APPROVE, Amount: 42L | Status `APPROVED`, audit log generated | PASS |
| **TC-MOD4-01** | Disbursement | Schedule multi-tranche payments | Approved amount 42L (T1: 25L, T2: 17L) | Sum matches sanctioned amount, references generated | PASS |
| **TC-MOD4-02** | Disbursement | Execute Tranche 1 payment | Valid PFMS reference | Status `DISBURSED`, program disbursed budget incremented | PASS |
| **TC-MOD4-03** | Reporting | Submit Milestone Utilization Certificate | Utilized: 24.5L (98%) | Report saved with `PENDING_VERIFICATION` | PASS |
| **TC-MOD4-04** | Reporting | Officer verifies Utilization Certificate | Satisfactory audit review | Report marked `VERIFIED_SATISFACTORY` | PASS |
| **TC-EDGE-01** | Edge Case | User with empty optional fields | Null phone, designation, org | Handled gracefully without NPE | PASS |
| **TC-EDGE-02** | Edge Case | 3500+ character grant description | Max text payload | Stored and retrieved accurately without truncation | PASS |

---

## 3. Summary of Test Execution
- Total Automated Test Cases Designed: 17
- Total Tests Executed: 17
- Passed: 17 (100%)
- Failed: 0
- Defect Density: 0.00
- Verification Outcome: **DEMO READY**
