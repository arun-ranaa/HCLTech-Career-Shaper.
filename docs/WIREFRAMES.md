# J18 | Grants Management System - UI Architecture & Wireframes

## 1. Information Architecture & Navigation

The Grants Management System features a modern, clean, government-portal grade responsive UI designed with Tailwind CSS conventions, high-contrast accessible typography, breadcrumbs, status tags, and role-driven navigation bars.

### 1.1 Navigation Structure
- **Public / Unauthenticated**:
  - Landing Hero: Public grant programs catalog with search and filters.
  - Login / Authentication Screen: Role-switcher / credential input.
- **Program Officer Portal**:
  - Dashboard: Macro KPIs, budget gauges, program pipeline, review queue.
  - Programs Management: Program list, create program wizard, rule configurator.
  - Applications Hub: Filterable data table, auto-eligibility badge, reviewer assign modal.
  - Review & Approval Desk: Detailed proposal view, scorecard summaries, sanction decision dialog.
  - Disbursements & Fund Flow: Scheduled vs disbursed tranches, PFMS trigger, utilization certificate audits.
- **Applicant Portal**:
  - My Applications Dashboard: Status badges (`SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `DISBURSED`).
  - Grant Application Form: Multi-step stepper (Entity Info -> Proposal -> Financials -> Upload Documents -> Self Declaration).
  - Milestone Progress & UC Submission: Tranche utilization submission and certificate upload.
- **Reviewer Portal**:
  - Review Queue: Assigned proposals with due dates.
  - Evaluation Rubric Form: 4 criteria sliders/inputs (Feasibility, Innovation, Budget, Impact) + comments.

---

## 2. Screen Wireframes & Component Layouts

### 2.1 Program Officer Dashboard
```
+----------------------------------------------------------------------------------------------------+
| [Gov Embelm] GRANTS MANAGEMENT SYSTEM (J18)       [Programs] [Applications] [Disbursements] [User: Sunita] |
+----------------------------------------------------------------------------------------------------+
| Overview Dashboard | Fiscal Year 2024-2025                                                          |
|                                                                                                    |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+       |
| | Total Grant Funds  | | Disbursed to Date  | | Total Applications | | Pending Reviews    |       |
| | INR 87.00 Crores   | | INR 16.40 Crores   | | 22 Submissions     | | 5 Under Review     |       |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+       |
|                                                                                                    |
| Active Grant Programs                                              [ + Create New Grant Program ]  |
| +------------------------------------------------------------------------------------------------+ |
| | Code        | Title                                 | Budget (INR) | Disbursed   | Status      | |
| |-------------+---------------------------------------+--------------+-------------+-------------| |
| | GMS-AGRI-01 | PM Matsya Sampada Aquaculture Grant   | 5,00,00,000  | 1,45,00,000 | [ ACTIVE  ] | |
| | GMS-CLEN-02 | National Clean Energy Solar Grant     | 12,00,00,000 | 4,20,00,000 | [ ACTIVE  ] | |
| | GMS-TECH-03 | Digital India AI & Cyber Grant        | 8,50,00,000  | 2,80,00,000 | [ ACTIVE  ] | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

### 2.2 Application Submission Stepper (Applicant)
```
+----------------------------------------------------------------------------------------------------+
| Apply for Grant: PM Matsya Sampada Aquaculture Tech Grant (GMS-2024-AGRI-01)                       |
| [Step 1: Entity Profile]  --->  [Step 2: Proposal Details]  --->  [Step 3: Documents & Submit]     |
+----------------------------------------------------------------------------------------------------+
| 1. Organization Legal Profile:                                                                     |
|    Legal Entity Type: [ Startup / MSME / NGO v ]       Years in Operation: [ 3 ]                   |
|    PAN Number:        [ AAACK1234F             ]       GSTIN:              [ 24AAACK1234F1Z8     ] |
|    Annual Turnover:   [ INR 1,20,00,000        ]       State / District:   [ Gujarat / Surat   v ] |
|                                                                                                    |
| 2. Project Proposal:                                                                               |
|    Project Title:     [ Smart IoT AquaAerator for Freshwater Prawns                              ] |
|    Requested Grant:   [ INR 45,00,000          ]       Duration (Months):  [ 18                  ] |
|    Beneficiaries:     [ 600+ Fish Farmers in Surat and Bharuch                                   ] |
|    Project Summary:   [ Detailed engineering description of solar aerators...                    ] |
|                                                                                                    |
| 3. Mandatory Compliance Checklist:                                                                 |
|    [x] Minimum 2 years operating history (Applicant: 3 yrs - PASS)                                 |
|    [x] Valid GST Registration attached (PASS)                                                      |
|    [x] Requested amount between INR 10L - 75L (PASS)                                               |
|                                                                                                    |
|                                                     [ Save Draft ]   [ Submit Application Now >> ] |
+----------------------------------------------------------------------------------------------------+
```

### 2.3 Evaluation Rubric & Sanction Desk (Reviewer & Officer)
```
+----------------------------------------------------------------------------------------------------+
| Application Appraisal: APP-2024-AGRI-00101 | KrishiAI Technologies Pvt Ltd                         |
+----------------------------------------------------------------------------------------------------+
| Technical Scorecard (0-100)                                                                        |
| 1. Technical Feasibility (0-25)   : [========================  ] 23 / 25                           |
| 2. Technological Innovation (0-25): [=====================     ] 21 / 25                           |
| 3. Budget Realism & RoI (0-25)    : [======================    ] 22 / 25                           |
| 4. Social & Economic Impact (0-25): [========================  ] 24 / 25                           |
| ------------------------------------------------------------------------                           |
| Total Evaluation Score: 90 / 100  (Grade: High Merit A+)                                           |
| Reviewer Recommendation: [ RECOMMEND_APPROVE v ]                                                   |
| Comments: Strong field test readiness with validated component sourcing.                           |
|                                                                                                    |
| Sanction Decision (Program Officer):                                                               |
| Approved Amount: [ INR 42,00,000      ]   Decision: [ APPROVE v ]                                  |
| Tranche 1: [ INR 25,00,000 ] (Upon MoU)  |  Tranche 2: [ INR 17,00,000 ] (Milestone 1 UC)         |
|                                                        [ Reject ]   [ Confirm Sanction Order >> ]  |
+----------------------------------------------------------------------------------------------------+
```

### 2.4 Fund Disbursement & Utilization Tracker
```
+----------------------------------------------------------------------------------------------------+
| Sanction ID: APP-2024-AGRI-00101 | Sanctioned: INR 42,00,000 | Disbursed: INR 25,00,000            |
+----------------------------------------------------------------------------------------------------+
| Tranche | Amount (INR) | Mode     | PFMS Reference     | Scheduled  | Status    | Action           |
|---------+--------------+----------+--------------------+------------+-----------+------------------|
| T-1     | 25,00,000    | PFMS_NEFT| PFMS-TR-2024-00101 | 05-05-2024 | DISBURSED | [ View Voucher ] |
| T-2     | 17,00,000    | PFMS_NEFT| PFMS-TR-2024-00102 | 15-11-2024 | SCHEDULED | [ Disburse Now ] |
+----------------------------------------------------------------------------------------------------+
| Milestone 1 Utilization Certificate (UC):                                                          |
| Title: Pond Aerator Procurement & Sensor Commissioning | Claimed: INR 24,50,000 (98%)              |
| Status: [ VERIFIED_SATISFACTORY ] by Officer Sunita Sharma on 22-10-2024                           |
+----------------------------------------------------------------------------------------------------+
```
