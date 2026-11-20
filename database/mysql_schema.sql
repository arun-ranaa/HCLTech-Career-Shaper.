-- ============================================================================
-- J18 | Grants Management System (Government & Public Sector)
-- MySQL Schema & Seed Data for MySQL Workbench 8.0
-- ============================================================================

CREATE DATABASE IF NOT EXISTS grants_management;
USE grants_management;

-- 1. Programs Table
CREATE TABLE IF NOT EXISTS programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    program_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    funding_agency VARCHAR(255) NOT NULL,
    total_budget DECIMAL(15,2) NOT NULL,
    disbursed_budget DECIMAL(15,2) DEFAULT 0.00,
    min_grant_amount DECIMAL(14,2) NOT NULL,
    max_grant_amount DECIMAL(14,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE'
);

-- 2. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    project_title VARCHAR(255) NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_email VARCHAR(150),
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100),
    requested_amount DECIMAL(14,2) NOT NULL,
    approved_amount DECIMAL(14,2) DEFAULT NULL,
    project_duration_months INT DEFAULT 12,
    eligibility_status VARCHAR(50) DEFAULT 'AUTO_ELIGIBLE',
    status VARCHAR(30) DEFAULT 'SUBMITTED',
    submission_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp VARCHAR(50),
    username VARCHAR(100),
    action VARCHAR(50),
    entity_id VARCHAR(50),
    details TEXT
);

-- ----------------------------------------------------------------------------
-- Insert Grant Programs
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO programs (program_id, program_code, title, category, funding_agency, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, status) VALUES
(1, 'GMS-2024-AGRI-01', 'PM Matsya Sampada Aquaculture Tech Grant', 'Agriculture & Fisheries', 'Ministry of Fisheries', 50000000.00, 14500000.00, 1000000.00, 7500000.00, 'ACTIVE'),
(2, 'GMS-2024-CLEAN-02', 'National Clean Energy Solar Innovation Grant', 'Clean Energy', 'Ministry of New and Renewable Energy', 120000000.00, 42000000.00, 2500000.00, 20000000.00, 'ACTIVE'),
(3, 'GMS-2024-TECH-03', 'Digital India AI & Cybersecurity Challenge Grant', 'Technology & Innovation', 'MeitY', 85000000.00, 28000000.00, 5000000.00, 15000000.00, 'ACTIVE');

-- ----------------------------------------------------------------------------
-- Insert Applications (Including Real-time Test Records)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO applications (application_number, project_title, applicant_name, applicant_email, organization_name, organization_type, requested_amount, approved_amount, project_duration_months, eligibility_status, status, submission_date) VALUES
('APP-2025-73608', 'land', 'Chirag Patel', 'chirag@krishiai-tech.com', 'KrishiAI Technologies Pvt Ltd', 'Startup', 4000000.00, 4000000.00, 12, 'AUTO_ELIGIBLE', 'APPROVED', '2026-11-20'),
('APP-2025-67301', 'Smart IoT AquaAerator System', 'Chirag Patel', 'chirag@krishiai-tech.com', 'KrishiAI Technologies Pvt Ltd', 'Startup', 4800000.00, NULL, 18, 'AUTO_ELIGIBLE', 'SUBMITTED', '2026-11-20'),
('APP-2024-AGRI-00101', 'Smart IoT AquaAerator for Freshwater Prawns', 'Chirag Patel', 'chirag@krishiai-tech.com', 'KrishiAI Technologies Pvt Ltd', 'Startup', 4500000.00, 4200000.00, 18, 'AUTO_ELIGIBLE', 'APPROVED', '2024-04-12'),
('APP-2024-CLEAN-00201', 'Community Solar Microgrid with Flow Batteries', 'Kavitha Reddy', 'kavitha@suryashakti.org', 'Surya Shakti Solar NGO', 'NGO / Trust', 15000000.00, 14000000.00, 24, 'AUTO_ELIGIBLE', 'APPROVED', '2024-05-25'),
('APP-2024-TECH-00301', 'BhashaAI: Multilingual Speech-to-Speech Engine', 'Chirag Patel', 'chirag@krishiai-tech.com', 'KrishiAI Technologies Pvt Ltd', 'Startup', 12000000.00, 11000000.00, 18, 'AUTO_ELIGIBLE', 'DISBURSED', '2024-06-15'),
('APP-2024-AGRI-00102', 'Cold-Water Trout Recirculatory Aquaculture System', 'Harpreet Singh', 'harpreet@greenharvest.com', 'Green Harvest Hydroponics LLP', 'MSME', 6000000.00, NULL, 24, 'AUTO_ELIGIBLE', 'UNDER_REVIEW', '2024-04-20');

-- ----------------------------------------------------------------------------
-- View Query for MySQL Workbench
-- ----------------------------------------------------------------------------
SELECT 
    application_number AS `Application No`,
    project_title AS `Project Title`,
    applicant_name AS `Applicant Name`,
    organization_name AS `Organization`,
    FORMAT(requested_amount, 2) AS `Requested (INR)`,
    status AS `Status`,
    eligibility_status AS `Eligibility`,
    submission_date AS `Submitted Date`
FROM applications
ORDER BY application_id DESC;
