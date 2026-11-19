# J18 | Grants Management System - Entity Relationship (ER) Summary

## 1. Architectural Overview & 3NF Normalization
The database schema for the **Grants Management System (Government & Public Sector)** is designed strictly adhering to Third Normal Form (3NF):
- **1NF**: Atomic attributes, no repeating groups, unique primary keys across all tables.
- **2NF**: All non-key attributes fully functionally dependent on the primary key (no partial dependencies).
- **3NF**: All attributes functionally dependent only on the primary key (no transitive dependencies).

---

## 2. Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned_to"
    USERS ||--o{ GRANT_PROGRAMS : "created_by"
    USERS ||--o{ APPLICATIONS : "submits"
    USERS ||--o{ APPLICATION_REVIEWS : "reviews"
    USERS ||--o{ APPROVAL_WORKFLOW_LOGS : "acts_on"
    USERS ||--o{ GRANT_DISBURSEMENTS : "disburses"
    USERS ||--o{ UTILIZATION_REPORTS : "verifies"
    USERS ||--o{ AUDIT_LOGS : "triggered_by"

    GRANT_PROGRAMS ||--o{ PROGRAM_ELIGIBILITY_CRITERIA : "defines"
    GRANT_PROGRAMS ||--o{ APPLICATIONS : "applies_for"

    APPLICATIONS ||--o{ APPLICATION_DOCUMENTS : "contains"
    APPLICATIONS ||--o{ APPLICATION_REVIEWS : "evaluated_by"
    APPLICATIONS ||--o{ APPROVAL_WORKFLOW_LOGS : "logs_history"
    APPLICATIONS ||--o{ GRANT_DISBURSEMENTS : "receives"
    APPLICATIONS ||--o{ UTILIZATION_REPORTS : "reports_progress"

    ROLES {
        NUMBER role_id PK
        VARCHAR2 role_name UK
        VARCHAR2 display_name
        VARCHAR2 description
    }

    USERS {
        NUMBER user_id PK
        VARCHAR2 username UK
        VARCHAR2 password_hash
        VARCHAR2 full_name
        VARCHAR2 email UK
        VARCHAR2 phone_number
        VARCHAR2 organization_name
        VARCHAR2 designation
        NUMBER role_id FK
        VARCHAR2 status
    }

    GRANT_PROGRAMS {
        NUMBER program_id PK
        VARCHAR2 program_code UK
        VARCHAR2 title
        VARCHAR2 category
        VARCHAR2 funding_agency
        NUMBER total_budget
        NUMBER disbursed_budget
        NUMBER min_grant_amount
        NUMBER max_grant_amount
        DATE start_date
        DATE end_date
        VARCHAR2 status
        NUMBER created_by FK
    }

    PROGRAM_ELIGIBILITY_CRITERIA {
        NUMBER criterion_id PK
        NUMBER program_id FK
        VARCHAR2 criterion_code
        VARCHAR2 criterion_name
        VARCHAR2 criterion_type
        VARCHAR2 expected_value
        CHAR is_mandatory
        NUMBER weightage
    }

    APPLICATIONS {
        NUMBER application_id PK
        VARCHAR2 application_number UK
        NUMBER program_id FK
        NUMBER applicant_id FK
        VARCHAR2 project_title
        VARCHAR2 project_summary
        NUMBER requested_amount
        NUMBER approved_amount
        NUMBER project_duration_months
        VARCHAR2 state_or_region
        VARCHAR2 district
        VARCHAR2 organization_type
        VARCHAR2 organization_pan
        VARCHAR2 eligibility_status
        VARCHAR2 status
    }

    APPLICATION_DOCUMENTS {
        NUMBER document_id PK
        NUMBER application_id FK
        VARCHAR2 document_type
        VARCHAR2 file_name
        VARCHAR2 file_path
        NUMBER file_size_kb
        VARCHAR2 content_type
    }

    APPLICATION_REVIEWS {
        NUMBER review_id PK
        NUMBER application_id FK
        NUMBER reviewer_id FK
        NUMBER feasibility_score
        NUMBER innovation_score
        NUMBER budget_realism_score
        NUMBER social_impact_score
        NUMBER total_score
        VARCHAR2 recommendation
        VARCHAR2 status
    }

    APPROVAL_WORKFLOW_LOGS {
        NUMBER log_id PK
        NUMBER application_id FK
        NUMBER action_by FK
        VARCHAR2 previous_status
        VARCHAR2 new_status
        VARCHAR2 action_taken
        VARCHAR2 decision_notes
        TIMESTAMP action_timestamp
    }

    GRANT_DISBURSEMENTS {
        NUMBER disbursement_id PK
        NUMBER application_id FK
        NUMBER tranche_number
        VARCHAR2 disbursement_reference UK
        NUMBER disbursement_amount
        VARCHAR2 payment_method
        VARCHAR2 bank_name
        VARCHAR2 account_number_masked
        VARCHAR2 ifsc_code
        VARCHAR2 transaction_reference
        DATE scheduled_date
        DATE disbursement_date
        VARCHAR2 status
        NUMBER disbursed_by FK
    }

    UTILIZATION_REPORTS {
        NUMBER report_id PK
        NUMBER application_id FK
        NUMBER tranche_number
        VARCHAR2 milestone_title
        NUMBER amount_utilized
        NUMBER utilization_percentage
        VARCHAR2 progress_narrative
        VARCHAR2 verification_status
        NUMBER verified_by FK
        TIMESTAMP verified_at
    }

    AUDIT_LOGS {
        NUMBER audit_id PK
        NUMBER user_id FK
        VARCHAR2 entity_name
        NUMBER entity_id
        VARCHAR2 action
        VARCHAR2 details
        VARCHAR2 ip_address
        TIMESTAMP created_at
    }
```

---

## 3. Relationships & Multiplicities

| Parent Table | Child Table | Cardinality | Foreign Key Constraint | Cascade Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `ROLES` | `USERS` | 1 to Many (`1:N`) | `fk_users_role` (`role_id`) | Restrict Delete |
| `USERS` | `GRANT_PROGRAMS` | 1 to Many (`1:N`) | `fk_program_creator` (`created_by`) | Restrict Delete |
| `GRANT_PROGRAMS` | `PROGRAM_ELIGIBILITY_CRITERIA` | 1 to Many (`1:N`) | `fk_crit_program` (`program_id`) | Cascade Delete |
| `GRANT_PROGRAMS` | `APPLICATIONS` | 1 to Many (`1:N`) | `fk_app_program` (`program_id`) | Restrict Delete |
| `USERS` | `APPLICATIONS` | 1 to Many (`1:N`) | `fk_app_applicant` (`applicant_id`) | Restrict Delete |
| `APPLICATIONS` | `APPLICATION_DOCUMENTS` | 1 to Many (`1:N`) | `fk_doc_application` (`application_id`) | Cascade Delete |
| `APPLICATIONS` | `APPLICATION_REVIEWS` | 1 to Many (`1:N`) | `fk_rev_application` (`application_id`) | Cascade Delete |
| `USERS` | `APPLICATION_REVIEWS` | 1 to Many (`1:N`) | `fk_rev_reviewer` (`reviewer_id`) | Restrict Delete |
| `APPLICATIONS` | `APPROVAL_WORKFLOW_LOGS` | 1 to Many (`1:N`) | `fk_wf_app` (`application_id`) | Cascade Delete |
| `USERS` | `APPROVAL_WORKFLOW_LOGS` | 1 to Many (`1:N`) | `fk_wf_actor` (`action_by`) | Restrict Delete |
| `APPLICATIONS` | `GRANT_DISBURSEMENTS` | 1 to Many (`1:N`) | `fk_disb_application` (`application_id`) | Restrict Delete |
| `USERS` | `GRANT_DISBURSEMENTS` | 1 to Many (`1:N`) | `fk_disb_officer` (`disbursed_by`) | Set Null / Restrict |
| `APPLICATIONS` | `UTILIZATION_REPORTS` | 1 to Many (`1:N`) | `fk_util_app` (`application_id`) | Cascade Delete |
| `USERS` | `UTILIZATION_REPORTS` | 1 to Many (`1:N`) | `fk_util_verifier` (`verified_by`) | Restrict Delete |
| `USERS` | `AUDIT_LOGS` | 1 to Many (`1:N`) | `fk_audit_user` (`user_id`) | Set Null |
