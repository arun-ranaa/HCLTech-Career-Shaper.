# J18 | Grants Management System - REST API Documentation

Base URL: `http://localhost:8080/api/v1`

All responses adhere to standard JSON response conventions. Successful requests return HTTP `200 OK` or `201 Created`. Error payloads follow RFC 7807 problem details with timestamp and message.

---

## 1. Authentication & User Management

### 1.1 User Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "username": "officer_sharma",
    "password": "Password@123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "bearer-token-jwt-string",
    "userId": 2,
    "username": "officer_sharma",
    "fullName": "Sunita Sharma",
    "email": "sunita.sharma@dst.gov.in",
    "role": "ROLE_PROGRAM_OFFICER",
    "organization": "Department of Science and Technology"
  }
  ```

### 1.2 Get Current User Profile
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`): Returns User DTO.

---

## 2. Module 1: Grant Program Setup & Configuration

### 2.1 List All Grant Programs
- **Endpoint**: `GET /programs`
- **Query Parameters**:
  - `status` (optional): `ACTIVE`, `DRAFT`, `UNDER_EVALUATION`, `CLOSED`
  - `category` (optional): `Clean Energy`, `Agriculture & Fisheries`, etc.
  - `search` (optional): search string matching title or agency
- **Response** (`200 OK`): Array of GrantProgramDTO objects.

### 2.2 Get Grant Program Details by ID
- **Endpoint**: `GET /programs/{id}`
- **Response** (`200 OK`):
  ```json
  {
    "programId": 1,
    "programCode": "GMS-2024-AGRI-01",
    "title": "PM Matsya Sampada Aquaculture Tech Grant",
    "category": "Agriculture & Fisheries",
    "fundingAgency": "Ministry of Fisheries, Animal Husbandry & Dairying",
    "description": "Financial grant for commercializing smart aeration...",
    "totalBudget": 50000000.00,
    "disbursedBudget": 14500000.00,
    "minGrantAmount": 1000000.00,
    "maxGrantAmount": 7500000.00,
    "startDate": "2024-04-01",
    "endDate": "2025-03-31",
    "status": "ACTIVE",
    "eligibilitySummary": "MSMEs or Startups with 2+ years operation.",
    "criteria": [
      {
        "criterionId": 1,
        "criterionCode": "MIN_OPERATING_YEARS",
        "criterionName": "Minimum Years in Operation",
        "criterionType": "NUMERIC_MIN",
        "expectedValue": "2",
        "isMandatory": "Y",
        "weightage": 25
      }
    ]
  }
  ```

### 2.3 Create New Grant Program
- **Endpoint**: `POST /programs`
- **Authorized Roles**: `ROLE_PROGRAM_OFFICER`, `ROLE_ADMIN`
- **Request Body**:
  ```json
  {
    "programCode": "GMS-2025-BIO-13",
    "title": "National Bio-Enzyme Clean Fuel Pilot Grant",
    "category": "Clean Energy",
    "fundingAgency": "Department of Biotechnology",
    "description": "Seed grants for enzymatic conversion of agricultural stubble into 2G ethanol.",
    "totalBudget": 45000000.00,
    "minGrantAmount": 2000000.00,
    "maxGrantAmount": 10000000.00,
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "status": "ACTIVE",
    "eligibilitySummary": "Registered biotechnology labs and clean fuel startups.",
    "criteria": [
      {
        "criterionCode": "MIN_OPERATING_YEARS",
        "criterionName": "Minimum Operating Years",
        "criterionType": "NUMERIC_MIN",
        "expectedValue": "2",
        "isMandatory": "Y",
        "weightage": 30
      }
    ]
  }
  ```
- **Response** (`201 Created`): Returns newly persisted GrantProgramDTO.

### 2.4 Update Grant Program Status
- **Endpoint**: `PATCH /programs/{id}/status`
- **Request Body**: `{"status": "CLOSED"}`
- **Response** (`200 OK`): Updated Program DTO.

---

## 3. Module 2: Application Submission & Eligibility Check

### 3.1 Submit Application
- **Endpoint**: `POST /applications`
- **Authorized Roles**: `ROLE_APPLICANT`
- **Request Body**:
  ```json
  {
    "programId": 1,
    "projectTitle": "Solar Aeration for Inland Saline Shrimp Culture",
    "projectSummary": "Deployment of floating DC aeration grids in Haryana saline belt.",
    "requestedAmount": 3500000.00,
    "projectDurationMonths": 18,
    "targetBeneficiaries": "200 saline soil aquaculture farmers",
    "stateOrRegion": "Haryana",
    "district": "Rohtak",
    "organizationType": "Startup",
    "organizationPan": "AABCS9911K",
    "organizationGstin": "06AABCS9911K1Z3",
    "annualTurnover": 7500000.00,
    "yearsInOperation": 3
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "applicationId": 23,
    "applicationNumber": "APP-2025-AGRI-00123",
    "programId": 1,
    "status": "SUBMITTED",
    "eligibilityStatus": "AUTO_ELIGIBLE",
    "eligibilityRemarks": "Automated Check Passed: All 4 mandatory criteria validated successfully.",
    "submissionDate": "2025-01-15T10:30:00"
  }
  ```

### 3.2 Run / Re-run Eligibility Evaluation
- **Endpoint**: `POST /applications/{id}/evaluate-eligibility`
- **Authorized Roles**: `ROLE_PROGRAM_OFFICER`, `ROLE_ADMIN`
- **Response** (`200 OK`): Evaluation result with criteria pass/fail breakdown.

### 3.3 List Applications
- **Endpoint**: `GET /applications`
- **Query Parameters**:
  - `programId` (optional)
  - `status` (optional): `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `DISBURSED`
  - `applicantId` (optional)
- **Response** (`200 OK`): List of Application summary objects.

### 3.4 Upload Application Document
- **Endpoint**: `POST /applications/{id}/documents`
- **Content-Type**: `multipart/form-data`
- **Parameters**: `file` (File), `documentType` (String)
- **Response** (`201 Created`): Document metadata object.

---

## 4. Module 3: Review and Approval Workflow

### 4.1 Assign Reviewers to Application
- **Endpoint**: `POST /applications/{id}/assign-reviewer`
- **Authorized Roles**: `ROLE_PROGRAM_OFFICER`
- **Request Body**: `{"reviewerId": 4}`
- **Response** (`200 OK`): Created ApplicationReview object.

### 4.2 Submit Review Evaluation
- **Endpoint**: `POST /reviews/{reviewId}/submit`
- **Authorized Roles**: `ROLE_REVIEWER`
- **Request Body**:
  ```json
  {
    "feasibilityScore": 23,
    "innovationScore": 24,
    "budgetRealismScore": 22,
    "socialImpactScore": 24,
    "recommendation": "RECOMMEND_APPROVE",
    "reviewComments": "Excellent proposal with strong execution capability."
  }
  ```
- **Response** (`200 OK`): Review result with computed total score (93/100).

### 4.3 Approve or Reject Application
- **Endpoint**: `POST /applications/{id}/decision`
- **Authorized Roles**: `ROLE_PROGRAM_OFFICER`
- **Request Body**:
  ```json
  {
    "decision": "APPROVE",
    "approvedAmount": 3200000.00,
    "decisionNotes": "Sanctioned based on unanimous reviewer recommendation (Score: 93/100)."
  }
  ```
- **Response** (`200 OK`): Updated application with transition recorded in Workflow Log.

### 4.4 Get Application Workflow History
- **Endpoint**: `GET /applications/{id}/workflow-history`
- **Response** (`200 OK`): Chronological list of all state changes and actor remarks.

---

## 5. Module 4: Grant Disbursement and Reporting

### 5.1 Schedule Disbursement Tranche
- **Endpoint**: `POST /applications/{id}/disbursements`
- **Authorized Roles**: `ROLE_PROGRAM_OFFICER`
- **Request Body**:
  ```json
  {
    "trancheNumber": 1,
    "disbursementAmount": 2000000.00,
    "paymentMethod": "PFMS_NEFT",
    "bankName": "Punjab National Bank",
    "accountNumberMasked": "XXXXXX9823",
    "ifscCode": "PUNB0123400",
    "scheduledDate": "2025-02-01",
    "remarks": "Tranche 1 upon signing Grant Agreement."
  }
  ```
- **Response** (`201 Created`): Created GrantDisbursement entity with generated reference.

### 5.2 Execute Disbursement
- **Endpoint**: `POST /disbursements/{disbursementId}/execute`
- **Authorized Roles**: `ROLE_PROGRAM_OFFICER`
- **Request Body**:
  ```json
  {
    "transactionReference": "PFMS20250201889922",
    "disbursementDate": "2025-02-01"
  }
  ```
- **Response** (`200 OK`): Status set to `DISBURSED`, updates program budget.

### 5.3 Submit Milestone Utilization Report
- **Endpoint**: `POST /applications/{id}/utilization-reports`
- **Authorized Roles**: `ROLE_APPLICANT`
- **Request Body**:
  ```json
  {
    "trancheNumber": 1,
    "milestoneTitle": "Civil Construction and Solar Equipment Procurement",
    "amountUtilized": 1950000.00,
    "utilizationPercentage": 97.5,
    "progressNarrative": "Civil shed completed and 30 solar pump kits installed on site."
  }
  ```
- **Response** (`201 Created`): Utilization report in `PENDING_VERIFICATION`.

### 5.4 Verify Utilization Report
- **Endpoint**: `PATCH /utilization-reports/{reportId}/verify`
- **Authorized Roles**: `ROLE_PROGRAM_OFFICER`
- **Request Body**:
  ```json
  {
    "verificationStatus": "VERIFIED_SATISFACTORY",
    "verificationRemarks": "Audited vouchers and geo-tagged photos verified."
  }
  ```
- **Response** (`200 OK`): Verified report.

### 5.5 Analytics & Executive Dashboard
- **Endpoint**: `GET /analytics/dashboard`
- **Authorized Roles**: Any authenticated user
- **Response** (`200 OK`):
  ```json
  {
    "totalPrograms": 12,
    "activePrograms": 10,
    "totalAllocatedBudget": 870000000.00,
    "totalDisbursedBudget": 164000000.00,
    "totalApplications": 22,
    "applicationsApproved": 8,
    "applicationsUnderReview": 5,
    "applicationsDisbursed": 3,
    "applicationsRejected": 1,
    "budgetUtilizationRate": 18.85
  }
  ```
