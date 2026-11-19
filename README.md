# J18 | Grants Management System

**Domain**: Government & Public Sector  
**Academic Affiliation**: ABES Engineering College | MCA 2nd Year  
**Track**: FSD Java  
**Technology Stack**: Java 17, Spring Boot 3.x, Angular 14+, Oracle Database 21c XE / H2 Database  
**Git Repository**: `mca2-java-grants-management-system`  

---

## 1. Project Overview
The **Grants Management System (GMS)** is an end-to-end digital governance platform that streamlines the lifecycle of public sector grant programs, application submissions, automated eligibility appraisals, committee evaluations, and milestone-linked financial disbursements via PFMS.

### Key Functional Modules
1. **Grant Program Setup & Configuration (Module 1)**:
   - Configure grant schemes, total corpus, tenure dates, and grant ceilings.
   - Customizable automated eligibility criteria rules (operational age, turnover, legal entity type, GSTIN).
2. **Application Submission & Eligibility Check (Module 2)**:
   - Multi-step proposal submission for startups, MSMEs, NGOs, and research labs.
   - Automated Eligibility Evaluation Engine validating criteria instantly upon submission.
3. **Review & Approval Workflow (Module 3)**:
   - Peer evaluation scorecard rubric (Feasibility, Innovation, Budget Realism, Social Impact: 0-100).
   - Sanctioning committee approval/rejection desk with immutable workflow audit logging.
4. **Grant Disbursement & Reporting (Module 4)**:
   - Multi-tranche milestone disbursement scheduling and execution with PFMS transaction tracking.
   - Beneficiary Utilization Certificate (UC) submission and officer physical verification audit.
   - Real-time executive dashboard for budget utilization benchmarks and sectoral allocations.

---

## 2. Directory Structure

```
grants/
├── backend/                  # Spring Boot 3.x Application
│   ├── src/main/java/com/abes/grants/
│   │   ├── config/           # Security, JWT, and Data Initializer
│   │   ├── controller/       # REST API Endpoints (M1 - M4)
│   │   ├── dto/              # Request/Response Data Transfer Objects
│   │   ├── model/            # 3NF Normalized JPA Entity Models
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   └── service/          # Business Services & Eligibility Engine
│   ├── src/main/resources/   # application.properties
│   ├── src/test/java/        # JUnit 5 & MockMvc Automated Tests
│   └── pom.xml               # Maven Project Object Model
├── frontend/                 # Angular 14+ Application & Web Portal
│   ├── src/                  # App components, services, templates, styles
│   ├── package.json          # Dependencies & npm scripts
│   ├── angular.json          # Angular CLI workspace config
│   └── server.js             # Zero-dependency Node HTTP dev server (Port 4200)
├── database/                 # Normalized Database Scripts
│   ├── schema.sql            # Oracle 21c XE 3NF DDL Script
│   ├── seed_data.sql         # Realistic Indian-context sample data
│   ├── ER_DIAGRAM.md         # Mermaid ER diagram & cardinality documentation
│   └── csv/                  # Master & Transaction tables in CSV format
├── docs/                     # Project Engineering Documentation
│   ├── REQUIREMENTS.md       # Epics, User Stories, and Acceptance Criteria
│   ├── API_DOCUMENTATION.md  # Complete REST API Specifications
│   ├── WIREFRAMES.md         # Component Layouts and Screen Wireframes
│   ├── TEST_REPORT.md        # Comprehensive Test Execution Matrix
│   └── SPRINT_PLAN.md        # 90-Hour Agile Sprints & Git Tagging Strategy
├── run-all.bat               # 1-Click launcher for both backend & frontend
├── run-backend.bat           # Backend launcher
├── run-frontend.bat          # Frontend launcher
├── .gitignore                # Git ignore rules
└── README.md                 # Project Master Guide
```

---

## 3. Seed Users & Demo Credentials

All test accounts share the default password: **`Password@123`**

| Username | Role | Full Name | Organization / Entity |
| :--- | :--- | :--- | :--- |
| `officer_sharma` | `ROLE_PROGRAM_OFFICER` | Sunita Sharma | Department of Science & Technology |
| `officer_nair` | `ROLE_PROGRAM_OFFICER` | Anand Nair | Ministry of Agriculture & Farmers Welfare |
| `applicant_patel` | `ROLE_APPLICANT` | Chirag Patel | KrishiAI Technologies Pvt Ltd (Startup) |
| `applicant_reddy` | `ROLE_APPLICANT` | Kavitha Reddy | Surya Shakti Solar NGO |
| `reviewer_kapoor` | `ROLE_REVIEWER` | Dr. Alok Kapoor | IIT Delhi - Evaluation Committee |
| `reviewer_iyer` | `ROLE_REVIEWER` | Dr. Meenakshi Iyer | IISc Bangalore |
| `admin` | `ROLE_ADMIN` | Rajesh K. Verma | Ministry of Finance / NIC |

---

## 4. Quick Start & Execution Guide

### Option A: 1-Click Launch (Recommended)
Double click `run-all.bat` or run:
```powershell
.\run-all.bat
```
This automatically starts:
- **Backend API**: `http://localhost:8080/api/v1`
- **H2 Web Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:grantsdb`, User: `sa`, Password: empty)
- **Frontend Portal**: `http://localhost:4200`

### Option B: Running Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Or open `backend/` in IntelliJ IDEA / Eclipse STS / VS Code and run `GrantsManagementSystemApplication.java`.

### Option C: Running Frontend (Angular / Web)
```bash
cd frontend
node server.js
```
Then visit `http://localhost:4200` in Google Chrome or Microsoft Edge.

---

## 5. Oracle Database 21c XE Setup (Production Profile)
To run against Oracle 21c XE:
1. Open Oracle SQL Developer and connect to `XEPDB1` as `SYSDBA`.
2. Run `database/schema.sql` to generate all tables, sequences, identity columns, and indexes.
3. Run `database/seed_data.sql` to populate realistic Indian-context master and transaction data.
4. In `backend/src/main/resources/application.properties`, uncomment the Oracle datasource properties:
   ```properties
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
   spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
   spring.datasource.username=GRANTS_ADMIN
   spring.datasource.password=GrantsAdmin#2024
   spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
   ```

---

## 6. Running Automated Tests
```bash
cd backend
mvn test
```
The test suite validates:
- `EligibilityEngineServiceTest`: Tests rule boundary values, turnover checks, and operational age criteria.
- `GrantsManagementSystemApplicationTests`: Verifies full Spring application context loading.

---

## 7. Git Workflow & Sprints

The project adheres to Agile branch and commit standards:
- `main`: Production-ready releases tagged at sprint gates.
- `develop`: Ongoing feature integration branch.
- Tags:
  - `v0.1.0` (Sprint 0: Architecture, Database 3NF, ER Model, Wireframes)
  - `v0.2.0` (Sprint 1: Module 1 Program Setup & Module 2 Application Submission)
  - `v0.3.0` (Sprint 2: Module 3 Reviewer Scoring Rubrics & Sanction Desk)
  - `v1.0.0` (Sprint 3: Module 4 Disbursements, Utilization Reports, Final Release)
