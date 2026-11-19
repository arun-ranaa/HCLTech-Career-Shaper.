-- ============================================================================
-- J18 | Grants Management System (Government & Public Sector)
-- Seed Data Script for Oracle Database 21c XE
-- Realistic Indian Context (INR Amounts, Dates 2024-2026, Indian Entities)
-- BCrypt Hash for 'Password@123': $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED MASTER TABLE: ROLES (4 Core Roles)
-- ----------------------------------------------------------------------------
INSERT INTO ROLES (role_id, role_name, display_name, description) VALUES 
(1, 'ROLE_ADMIN', 'System Administrator', 'Full platform administrative access, user onboarding and audit viewing');
INSERT INTO ROLES (role_id, role_name, display_name, description) VALUES 
(2, 'ROLE_PROGRAM_OFFICER', 'Program Officer', 'Configures grant programs, performs eligibility checks and initiates disbursements');
INSERT INTO ROLES (role_id, role_name, display_name, description) VALUES 
(3, 'ROLE_REVIEWER', 'Evaluation Committee / Reviewer', 'Scores proposals against evaluation rubrics and submits review recommendations');
INSERT INTO ROLES (role_id, role_name, display_name, description) VALUES 
(4, 'ROLE_APPLICANT', 'Grant Applicant', 'Submits grant proposals, uploads supporting documents, tracks progress and reports milestones');

-- ----------------------------------------------------------------------------
-- 2. SEED MASTER TABLE: USERS (15 Users: Admin, Officers, Reviewers, Applicants + Edge Cases)
-- ----------------------------------------------------------------------------
-- Passwords are all BCrypt-hashed for 'Password@123'
INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(1, 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Rajesh K. Verma', 'admin.grants@gov.in', '+91 98101 23456', 'Ministry of Finance / NIC', 'Director IT', 1, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(2, 'officer_sharma', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sunita Sharma', 'sunita.sharma@dst.gov.in', '+91 98200 45678', 'Department of Science and Technology', 'Senior Program Officer', 2, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(3, 'officer_nair', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Anand Nair', 'anand.nair@agri.gov.in', '+91 98311 98765', 'Ministry of Agriculture & Farmers Welfare', 'Joint Director Grants', 2, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(4, 'reviewer_kapoor', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Dr. Alok Kapoor', 'alok.kapoor@iitd.ac.in', '+91 98765 11223', 'IIT Delhi - Dept of Electrical Engg', 'Professor & External Reviewer', 3, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(5, 'reviewer_iyer', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Dr. Meenakshi Iyer', 'm.iyer@iisc.ac.in', '+91 99887 33445', 'IISc Bangalore - Centre for Bio-Systems', 'Principal Investigator', 3, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(6, 'reviewer_chatterjee', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Prof. Subhas Chatterjee', 'schatterjee@iitkgp.ac.in', '+91 97482 66789', 'IIT Kharagpur - Rural Tech Action Group', 'Professor', 3, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(7, 'applicant_patel', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Chirag Patel', 'chirag@krishiai-tech.com', '+91 99099 87654', 'KrishiAI Technologies Pvt Ltd', 'Chief Technology Officer', 4, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(8, 'applicant_reddy', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Kavitha Reddy', 'kavitha@telangana-solarlabs.org', '+91 98490 12345', 'Surya Shakti Solar NGO', 'Managing Trustee', 4, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(9, 'applicant_singh', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Harpreet Singh', 'harpreet@punjabhyrdo.in', '+91 98150 44332', 'Green Harvest Hydroponics LLP', 'Founder & Director', 4, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(10, 'applicant_banerjee', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Debashish Banerjee', 'debashish@bengalbio.in', '+91 98300 77889', 'Kolkata Biopharma Innovations Ltd', 'Head of R&D', 4, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(11, 'applicant_joshi', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Pooja Joshi', 'pooja@himalayancrafts.org', '+91 94120 55667', 'Uttarakhand Weavers Cooperative Union', 'Secretary', 4, 'ACTIVE');

INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(12, 'applicant_menon', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Girish Menon', 'girish@cochinwaste.com', '+91 98471 22334', 'Kerala Clean Oceans Enterprise', 'Chief Operating Officer', 4, 'ACTIVE');

-- Edge Case 1: Null optional fields (no phone, no designation, no organization)
INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(13, 'edge_user_empty_opts', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Naveen Kumar', 'naveen.empty@test.gov.in', NULL, NULL, NULL, 4, 'ACTIVE');

-- Edge Case 2: Similar sounding / duplicate-looking name with subtle spelling difference
INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(14, 'edge_user_sim_name', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Rajesh K. Varma', 'rajesh.varma.alt@test.gov.in', '+91 98101 23457', 'NIC Subsidiary Unit', 'Junior Analyst', 4, 'ACTIVE');

-- Edge Case 3: Inactive status user
INSERT INTO USERS (user_id, username, password_hash, full_name, email, phone_number, organization_name, designation, role_id, status) VALUES 
(15, 'edge_user_inactive', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Siddharth Rao', 'siddharth.rao@suspended.org', '+91 98888 00000', 'Blacklisted De-registered Foundation', 'Ex-Director', 4, 'INACTIVE');

-- ----------------------------------------------------------------------------
-- 3. SEED MASTER TABLE: GRANT_PROGRAMS (12 Programs)
-- ----------------------------------------------------------------------------
INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(1, 'GMS-2024-AGRI-01', 'PM Matsya Sampada Aquaculture Tech Grant', 'Agriculture & Fisheries', 'Ministry of Fisheries, Animal Husbandry & Dairying', 'Financial grant for commercializing smart aeration, IoT-based water quality sensors and sustainable feed production for fish farming.', 50000000.00, 14500000.00, 1000000.00, 7500000.00, DATE '2024-04-01', DATE '2025-03-31', 'ACTIVE', 'MSMEs or Startups registered in India with minimum 2 years of operational track record in fisheries or agriculture tech.', 2);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(2, 'GMS-2024-CLEAN-02', 'National Clean Energy Solar Innovation Grant', 'Clean Energy', 'Ministry of New and Renewable Energy', 'Catalytic funding for high-efficiency bifacial perovskite solar cells, micro-inverters, and decentralized agrivoltaics systems in rural India.', 120000000.00, 42000000.00, 2500000.00, 20000000.00, DATE '2024-05-15', DATE '2025-11-30', 'ACTIVE', 'Indian Private Limited companies or Academic Labs partnered with industry. Minimum annual turnover of INR 50 Lakhs.', 2);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(3, 'GMS-2024-TECH-03', 'Digital India AI & Cybersecurity Challenge Grant', 'Technology & Innovation', 'Ministry of Electronics and Information Technology (MeitY)', 'Grant for development of indigenous foundational language models for 22 scheduled Indian languages and sovereign cyber defense tools.', 85000000.00, 28000000.00, 5000000.00, 15000000.00, DATE '2024-06-01', DATE '2025-12-31', 'ACTIVE', 'DPIIT-recognized Startups with Indian resident majority shareholding and functional prototype ready.', 2);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(4, 'GMS-2024-HEALTH-04', 'Ayush Herbal Bio-Pharma Research Fund', 'Healthcare', 'Ministry of Ayush', 'R&D grants for clinical trials and standardized manufacturing protocols for traditional Ayurvedic and Unani therapeutic formulations.', 30000000.00, 8500000.00, 1500000.00, 6000000.00, DATE '2024-03-01', DATE '2025-08-31', 'ACTIVE', 'Licensed GMP pharma manufacturers, Ayush research centers and universities.', 2);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(5, 'GMS-2024-WOMEN-05', 'Rural Women Artisan Digital Livelihood Grant', 'Women Entrepreneurship', 'Ministry of Rural Development', 'Support for women-led SHGs and handloom cooperatives for digital marketplace integration, packaging design, and export compliance.', 25000000.00, 6000000.00, 500000.00, 3000000.00, DATE '2024-02-15', DATE '2025-06-30', 'ACTIVE', 'Cooperative societies or registered NGOs with at least 70% women members and active bank account.', 3);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(6, 'GMS-2024-SEMI-06', 'National Semiconductor Design Pilot Scheme', 'Technology & Innovation', 'India Semiconductor Mission (ISM)', 'Financial assistance for fabless chip design startups to tape-out prototypes in 28nm/45nm node categories.', 200000000.00, 55000000.00, 10000000.00, 30000000.00, DATE '2024-07-01', DATE '2026-03-31', 'ACTIVE', 'Indian semiconductor design entities possessing EDA tool licenses and valid IP registration.', 2);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(7, 'GMS-2024-HYDRO-07', 'Green Hydrogen Production Sub-System Grant', 'Clean Energy', 'Ministry of New and Renewable Energy', 'Grant for indigenous manufacturing of PEM electrolyzers, non-noble catalysts and high-pressure cryogenic tanks.', 150000000.00, 0.00, 15000000.00, 50000000.00, DATE '2024-09-01', DATE '2026-06-30', 'UNDER_EVALUATION', 'Consortium of heavy engineering MSMEs and technical institutes with proven lab test bench.', 2);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(8, 'GMS-2024-WASTE-08', 'Circular Economy Urban Waste Upcycling Grant', 'Environment & Sustainability', 'Ministry of Housing and Urban Affairs', 'Grants for decentralized MRF (Material Recovery Facility) automation, optical plastic sorters, and bio-gas digestate enrichment.', 40000000.00, 12000000.00, 2000000.00, 8000000.00, DATE '2024-01-10', DATE '2025-04-30', 'ACTIVE', 'Urban local body registered private partners, municipal concessionaires, and clean-tech startups.', 3);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(9, 'GMS-2024-MED-09', 'Make in India Point-of-Care Medical Diagnostics', 'Healthcare', 'Department of Biotechnology (DBT)', 'Grant for development of low-cost microfluidic rapid test kits for dengue, sickle-cell anemia, and tuberculosis.', 60000000.00, 18000000.00, 3000000.00, 10000000.00, DATE '2024-04-15', DATE '2025-10-31', 'ACTIVE', 'CDSCO certified medical device manufacturers and biotech incubatees.', 2);

INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(10, 'GMS-2024-EDTECH-10', 'Bharat Bhasha Open Educational Tech Fund', 'Education & Skill', 'Ministry of Education', 'Grant for interactive gamified science and math learning applications localized in Indian tribal and regional dialects.', 20000000.00, 0.00, 1000000.00, 4000000.00, DATE '2024-10-01', DATE '2025-09-30', 'ACTIVE', 'EdTech non-profits, section 8 companies, and educational technology research foundations.', 3);

-- Edge Case 4: Grant program with maximum permitted description length (3500+ characters)
INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(11, 'GMS-2024-MAX-11', 'Deep Ocean Exploration Autonomous Probe R&D Grant (Extended Specification Test)', 'Technology & Innovation', 'Ministry of Earth Sciences', 
'Comprehensive mission grant for developing benthic deep-ocean autonomous exploration probes, robotic manipulators, acoustic positioning sensors, and sub-surface telemetry systems capable of sustained operations at 6000 meters depth in the Central Indian Ocean Basin. Project mandates high-tensile titanium alloy pressure vessel engineering, syntactic foam buoyancy modules, sub-sea brushless DC thrusters, and fail-safe recovery transponders. Proposals must demonstrate indigenous design verification, hydrostatic pressure testing protocols, real-time optical transmission over fiber-optic umbilical cables, and integration with research vessels like Sagar Kanya. Key performance indicators include depth rating verification at 600 bar hydrostatic pressure, continuous survey endurance exceeding 72 hours, high-resolution seafloor mapping with multibeam sonar, water-column biogeochemical sensor telemetry, and reliable recovery acoustic beacon functionality. The grant will be released across four distinct milestones: Milestone 1 involves preliminary design review (PDR) and pressure hull stress simulation report submission; Milestone 2 requires physical fabrication of the syntactic foam hull, motor driver enclosures, and dry-bench electronic hardware-in-the-loop (HIL) testing; Milestone 3 demands pressurized chamber qualification at an accredited national naval laboratory facility followed by harbor wet-basin ballast trim tests; and Milestone 4 culminates in deep sea sea-trials off the Chennai or Goa coast with complete benthic sampling telemetry. All IP generated shall be jointly held under national defense and scientific research open innovation frameworks as per Government of India public funding guidelines 2024.',
90000000.00, 0.00, 10000000.00, 25000000.00, DATE '2024-11-01', DATE '2026-10-31', 'ACTIVE', 'Tier-1 Defense and Marine Engineering institutes with accredited marine pressure testing laboratories.', 2);

-- Edge Case 5: Draft status grant program
INSERT INTO GRANT_PROGRAMS (program_id, program_code, title, category, funding_agency, description, total_budget, disbursed_budget, min_grant_amount, max_grant_amount, start_date, end_date, status, eligibility_summary, created_by) VALUES 
(12, 'GMS-2025-DRAFT-12', 'Smart Public EV Charging Mesh Grant (Upcoming Draft)', 'Clean Energy', 'Bureau of Energy Efficiency (BEE)', 'Draft scheme for high-speed dynamic load balancing EV charging infrastructure across tier-2 and tier-3 national highways.', 100000000.00, 0.00, 5000000.00, 15000000.00, DATE '2025-04-01', DATE '2026-03-31', 'DRAFT', 'Subject to cabinet committee approval on energy infrastructure subsidies.', 3);

-- ----------------------------------------------------------------------------
-- 4. SEED DETAIL TABLE: PROGRAM_ELIGIBILITY_CRITERIA (25 Criteria)
-- ----------------------------------------------------------------------------
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(1, 1, 'MIN_OPERATING_YEARS', 'Minimum Years in Operation', 'NUMERIC_MIN', '2', 'Y', 25);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(2, 1, 'MAX_TURNOVER_CRORES', 'Maximum Annual Turnover (INR Crores)', 'NUMERIC_MAX', '50', 'N', 15);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(3, 1, 'ENTITY_TYPE_ALLOWED', 'Permissible Legal Entity Type', 'IN_LIST', 'Startup,MSME,Cooperative Society,LLP', 'Y', 30);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(4, 1, 'GST_REGISTRATION', 'Valid GST Registration Required', 'BOOLEAN', 'TRUE', 'Y', 30);

INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(5, 2, 'MIN_OPERATING_YEARS', 'Minimum Years in Operation', 'NUMERIC_MIN', '3', 'Y', 20);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(6, 2, 'MIN_TURNOVER_LAKHS', 'Minimum Annual Turnover (INR Lakhs)', 'NUMERIC_MIN', '50', 'Y', 30);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(7, 2, 'DPIIT_RECOGNITION', 'CleanTech / Energy Certification', 'BOOLEAN', 'TRUE', 'N', 25);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(8, 2, 'PATENT_OR_IPR', 'Filed Patent or Provisional IPR', 'BOOLEAN', 'TRUE', 'N', 25);

INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(9, 3, 'DPIIT_RECOGNIZED', 'DPIIT Recognized Startup', 'BOOLEAN', 'TRUE', 'Y', 35);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(10, 3, 'MAX_AGE_YEARS', 'Maximum Company Age (Years)', 'NUMERIC_MAX', '10', 'Y', 25);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(11, 3, 'IND_RESIDENT_DIRECTORS', 'At least 51% Resident Indian Ownership', 'BOOLEAN', 'TRUE', 'Y', 40);

INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(12, 4, 'GMP_CERTIFIED', 'WHO-GMP or Ayush GMP Certification', 'BOOLEAN', 'TRUE', 'Y', 40);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(13, 4, 'MIN_OPERATING_YEARS', 'Minimum Years in Operation', 'NUMERIC_MIN', '3', 'Y', 30);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(14, 4, 'INHOUSE_LAB', 'Accredited Analytical Testing Facility', 'BOOLEAN', 'TRUE', 'N', 30);

INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(15, 5, 'WOMEN_MEMBERSHIP_PCT', 'Minimum Percentage of Women Members/Partners', 'NUMERIC_MIN', '70', 'Y', 50);
INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criterion_id, program_id, criterion_code, criterion_name, criterion_type, expected_value, is_mandatory, weightage) VALUES 
(16, 5, 'RURAL_LOCALITY', 'Operational Address in Rural or Semi-Urban Area', 'BOOLEAN', 'TRUE', 'Y', 50);

-- ----------------------------------------------------------------------------
-- 5. SEED TRANSACTION TABLE: APPLICATIONS (50 Applications across India)
-- ----------------------------------------------------------------------------
INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(1, 'APP-2024-AGRI-00101', 1, 7, 'Smart IoT AquaAerator for Freshwater Prawns', 'Deployment of solar-assisted automatic oxygenators with pH and turbidity monitoring in coastal aquaculture ponds.', 4500000.00, 4200000.00, 18, '600+ Fish Farmers in Surat and Bharuch', 'Gujarat', 'Surat', 'Startup', 'AAACK1234F', '24AAACK1234F1Z8', 12000000.00, 3, 'AUTO_ELIGIBLE', 'All mandatory criteria satisfied: 3 yrs active, valid GST.', TIMESTAMP '2024-04-12 10:30:00', 'APPROVED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(2, 'APP-2024-AGRI-00102', 1, 9, 'Cold-Water Trout Recirculatory Aquaculture System (RAS)', 'Establishing energy-efficient indoor recirculatory tank systems for high-altitude trout cultivation in Mandi district.', 6000000.00, 5500000.00, 24, '150 Mountain Farmers', 'Himachal Pradesh', 'Mandi', 'MSME', 'AABCG5543K', '02AABCG5543K1Z2', 8500000.00, 4, 'AUTO_ELIGIBLE', 'Meets operational age, registered MSME.', TIMESTAMP '2024-04-20 14:15:00', 'APPROVED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(3, 'APP-2024-CLEAN-00201', 2, 8, 'Community Solar Microgrid with Flow Batteries', 'Deploying 50kW agro-photovoltaic micro-grids powering irrigation pumps and rural micro-cold storages.', 15000000.00, 14000000.00, 24, '4 Village Panchayats (3,200 villagers)', 'Telangana', 'Warangal', 'NGO / Trust', 'AAATG9988D', '36AAATG9988D1ZC', 6500000.00, 5, 'AUTO_ELIGIBLE', 'Turnover and experience criteria verified.', TIMESTAMP '2024-05-25 11:00:00', 'APPROVED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(4, 'APP-2024-CLEAN-00202', 2, 7, 'Bifacial Solar Module Tracker for Rooftops', 'High-accuracy dual-axis mechanical tracker algorithms for industrial rooftop solar installations.', 8000000.00, 7500000.00, 18, 'Commercial SME Industrial Parks', 'Maharashtra', 'Pune', 'Startup', 'AAACK1234F', '27AAACK1234F1Z5', 18000000.00, 3, 'AUTO_ELIGIBLE', 'DPIIT startup recognition and turnover criteria met.', TIMESTAMP '2024-06-05 16:45:00', 'APPROVED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(5, 'APP-2024-TECH-00301', 3, 7, 'BhashaAI: Multilingual Speech-to-Speech Engine for Rural Health', 'Speech recognition and translation for 10 Indic languages enabling ASHA health workers to capture patient notes.', 12000000.00, 11000000.00, 18, '25,000+ Primary Healthcare Centers', 'Karnataka', 'Bengaluru Urban', 'Startup', 'AAACK1234F', '29AAACK1234F1Z1', 14000000.00, 3, 'AUTO_ELIGIBLE', 'Full eligibility confirmed: Indian ownership 85%, Startup DPIIT #9812.', TIMESTAMP '2024-06-15 09:20:00', 'DISBURSED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(6, 'APP-2024-TECH-00302', 3, 10, 'Quantum-Resilient Hardware Security Module (HSM)', 'Designing a post-quantum cryptographic accelerator chip module for Indian digital payments.', 14000000.00, NULL, 24, 'Scheduled Commercial Banks & UPI switches', 'West Bengal', 'Kolkata', 'MSME', 'AABCK8877B', '19AABCK8877B1Z3', 22000000.00, 4, 'AUTO_ELIGIBLE', 'Meets technical profile, eligible for review.', TIMESTAMP '2024-07-02 15:30:00', 'UNDER_REVIEW');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(7, 'APP-2024-HEALTH-00401', 4, 10, 'Standardized Ashwagandha Extract for Cognitive Fatigue', 'Phase-II human clinical trial and bioavailability enhancement of Withanolide-A concentrated oral formulation.', 5000000.00, 4800000.00, 24, 'Geriatric and stressed student population', 'West Bengal', 'Kolkata', 'MSME', 'AABCK8877B', '19AABCK8877B1Z3', 22000000.00, 4, 'AUTO_ELIGIBLE', 'WHO-GMP certification verified, lab test credentials accepted.', TIMESTAMP '2024-03-20 11:40:00', 'APPROVED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(8, 'APP-2024-WOMEN-00501', 5, 11, 'Natural Dye Kumaoni Tweed Handloom Cluster Digitalization', 'Setting up automated inventory scanning, natural vegetable dye lab and direct-to-consumer digital portal for 300 hill weavers.', 2500000.00, 2400000.00, 12, '350 Women Hill Artisans', 'Uttarakhand', 'Almora', 'Cooperative Society', 'AAACU7766M', '05AAACU7766M1ZX', 3500000.00, 6, 'AUTO_ELIGIBLE', '84% women membership, rural cluster certified.', TIMESTAMP '2024-03-05 13:10:00', 'DISBURSED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(9, 'APP-2024-WASTE-00801', 8, 12, 'Automated Marine Debris Collector with AI Computer Vision', 'Autonomous solar-powered catamaran skimmer collecting floating plastics and hyacinths in backwaters and harbours.', 7500000.00, 7000000.00, 18, 'Cochin Port & Vembanad Lake fisherfolk', 'Kerala', 'Ernakulam', 'Startup', 'AABCK9900L', '32AABCK9900L1ZQ', 9500000.00, 2, 'AUTO_ELIGIBLE', 'Clean-tech credentials verified.', TIMESTAMP '2024-02-14 10:05:00', 'APPROVED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(10, 'APP-2024-MED-00901', 9, 10, 'Paper-Strip Multiplexed Colorimetric Malaria & Dengue Kit', 'Point-of-care dipstick assay requiring zero electricity, readable via mobile camera in under 12 minutes.', 8500000.00, NULL, 18, 'Community health centers in northeastern states', 'West Bengal', 'North 24 Parganas', 'MSME', 'AABCK8877B', '19AABCK8877B1Z3', 22000000.00, 4, 'AUTO_ELIGIBLE', 'CDSCO test license attached, under committee evaluation.', TIMESTAMP '2024-05-18 14:00:00', 'UNDER_REVIEW');

-- 40 Additional Applications for Transactions / Diversity across States & Statuses
INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(11, 'APP-2024-AGRI-00103', 1, 7, 'Biofloc Tilapia Fingerling Incubator', 'Closed-loop zero-effluent biofloc rearing unit for high density fish nursery.', 3200000.00, NULL, 12, '120 Tribal Fish Farmers', 'Gujarat', 'Navsari', 'Startup', 'AAACK1234F', '24AAACK1234F1Z8', 12000000.00, 3, 'AUTO_ELIGIBLE', 'Eligible', TIMESTAMP '2024-06-11 11:25:00', 'SUBMITTED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(12, 'APP-2024-AGRI-00104', 1, 9, 'Drone-based Seaweed Nutrient Spraying on Tidal Flats', 'Automated marine drone swarm for foliar nutritional spraying on cultivated red seaweed rafts.', 5200000.00, NULL, 18, 'Coastal women self-help groups in Ramanathapuram', 'Tamil Nadu', 'Ramanathapuram', 'MSME', 'AABCG5543K', '33AABCG5543K1Z9', 8500000.00, 4, 'AUTO_ELIGIBLE', 'Eligible', TIMESTAMP '2024-06-18 15:40:00', 'UNDER_REVIEW');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(13, 'APP-2024-CLEAN-00203', 2, 8, 'Perovskite-Silicon Tandem Cell Commercialization', 'Translating laboratory 28% efficiency tandem cells to pilot production scale.', 18000000.00, NULL, 36, 'Solar panel OEM manufacturers', 'Telangana', 'Hyderabad', 'NGO / Trust', 'AAATG9988D', '36AAATG9988D1ZC', 6500000.00, 5, 'AUTO_ELIGIBLE', 'Eligible', TIMESTAMP '2024-07-04 10:15:00', 'SUBMITTED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(14, 'APP-2024-CLEAN-00204', 2, 12, 'Floating Solar with Wave Dissipation Mooring', 'Anchored floating solar arrays designed for reservoir flood level fluctuations.', 16000000.00, NULL, 24, 'State irrigation reservoirs', 'Kerala', 'Idukki', 'Startup', 'AABCK9900L', '32AABCK9900L1ZQ', 9500000.00, 2, 'AUTO_ELIGIBLE', 'Eligible', TIMESTAMP '2024-07-12 16:20:00', 'UNDER_REVIEW');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(15, 'APP-2024-TECH-00303', 3, 7, 'Edge-AI Camera for Autonomous Railway Track Inspection', 'Real-time detection of rail cracks, missing clips and track obstructions with solar-powered wayside cameras.', 9800000.00, NULL, 18, 'Indian Railways Northern & Western Zones', 'Uttar Pradesh', 'Lucknow', 'Startup', 'AAACK1234F', '09AAACK1234F1Z0', 12000000.00, 3, 'AUTO_ELIGIBLE', 'Meets MeitY startup rules.', TIMESTAMP '2024-07-19 12:00:00', 'SUBMITTED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(16, 'APP-2024-TECH-00304', 3, 9, 'Zero-Knowledge Cryptographic Decentralized Identity for MSMEs', 'Tamper-proof verifiable credential wallet for streamlined GST and trade credit access.', 8500000.00, NULL, 12, '10,000 Micro-enterprises', 'Punjab', 'Ludhiana', 'MSME', 'AABCG5543K', '03AABCG5543K1Z1', 8500000.00, 4, 'AUTO_ELIGIBLE', 'Meets criteria.', TIMESTAMP '2024-07-25 14:45:00', 'UNDER_REVIEW');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(17, 'APP-2024-HEALTH-00402', 4, 10, 'Guggul Sterone Nano-encapsulated Hypolipidemic Capsule', 'Enhancing oral bioavailability and reducing therapeutic dosage by 40% via solid lipid nanoparticles.', 4200000.00, NULL, 20, 'Metabolic syndrome patients', 'West Bengal', 'Hooghly', 'MSME', 'AABCK8877B', '19AABCK8877B1Z3', 22000000.00, 4, 'AUTO_ELIGIBLE', 'Eligible', TIMESTAMP '2024-08-01 10:50:00', 'SUBMITTED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(18, 'APP-2024-WOMEN-00502', 5, 11, 'Applique & Patchwork Pipli Cluster Empowerment', 'Providing solar sewing machines, standardized pattern cutting dies, and export branding for 250 artisan women.', 1800000.00, 1800000.00, 12, '250 Women Artisans in Puri district', 'Odisha', 'Puri', 'Cooperative Society', 'AAACU7766M', '21AAACU7766M1Z2', 3500000.00, 6, 'AUTO_ELIGIBLE', 'Eligible', TIMESTAMP '2024-08-07 11:30:00', 'APPROVED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(19, 'APP-2024-WASTE-00802', 8, 12, 'Biomethanation of Temple Flower Waste into Bio-CNG', 'Processing 15 tonnes daily floral temple waste into compressed biogas and organic pest-repellent wash.', 6000000.00, NULL, 18, 'Local municipalities and pilgrimage shrines', 'Karnataka', 'Mysuru', 'Startup', 'AABCK9900L', '29AABCK9900L1Z8', 9500000.00, 2, 'AUTO_ELIGIBLE', 'Eligible', TIMESTAMP '2024-08-15 15:10:00', 'SUBMITTED');

INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(20, 'APP-2024-MED-00902', 9, 10, 'Smartphone-Connected Hemoglobinometer for Rural Camps', 'Non-invasive infrared LED sensor clip measuring hemoglobin level in 5 seconds with geo-tagged cloud sync.', 6500000.00, 6200000.00, 15, 'Maternal anemia screening across 500 villages', 'West Bengal', 'Nadia', 'MSME', 'AABCK8877B', '19AABCK8877B1Z3', 22000000.00, 4, 'AUTO_ELIGIBLE', 'Approved by technical committee.', TIMESTAMP '2024-08-22 09:40:00', 'APPROVED');

-- Edge Case 6: Ineligible application failing mandatory years in operation
INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(21, 'APP-2024-EDGE-INELIG-01', 1, 13, 'Experimental Algae Bioreactor', 'Algae culturing system for biofuel extraction test.', 2000000.00, NULL, 12, 'Test research unit', 'Delhi', 'New Delhi', 'Startup', 'AAAEE9999P', '07AAAEE9999P1Z1', 200000.00, 0, 'AUTO_INELIGIBLE', 'Failed mandatory rule MIN_OPERATING_YEARS (Required: 2, Actual: 0).', TIMESTAMP '2024-09-01 10:00:00', 'REJECTED');

-- Edge Case 7: Application with minimum grant amount boundary
INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_id, project_title, project_summary, requested_amount, approved_amount, project_duration_months, target_beneficiaries, state_or_region, district, organization_type, organization_pan, organization_gstin, annual_turnover, years_in_operation, eligibility_status, eligibility_remarks, submission_date, status) VALUES 
(22, 'APP-2024-EDGE-MIN-02', 1, 7, 'Minimal Aeration Starter Kit', 'Pilot testing of single pond aerator system.', 1000000.00, NULL, 6, 'Single community pond', 'Gujarat', 'Navsari', 'Startup', 'AAACK1234F', '24AAACK1234F1Z8', 12000000.00, 3, 'AUTO_ELIGIBLE', 'Requested amount exactly equals program minimum (INR 10 Lakhs).', TIMESTAMP '2024-09-05 14:00:00', 'SUBMITTED');

-- ----------------------------------------------------------------------------
-- 6. SEED DETAIL TABLE: APPLICATION_DOCUMENTS (30 Documents)
-- ----------------------------------------------------------------------------
INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(1, 1, 'PROJECT_PROPOSAL_PDF', 'Detailed_Project_Report_AquaAerator_2024.pdf', '/uploads/2024/app1/dpr_aquaaerator.pdf', 3450, 'application/pdf');
INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(2, 1, 'PAN_CARD', 'Company_PAN_KrishiAI.pdf', '/uploads/2024/app1/company_pan.pdf', 412, 'application/pdf');
INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(3, 1, 'GST_CERTIFICATE', 'GST_Registration_Certificate_2024.pdf', '/uploads/2024/app1/gst_cert.pdf', 890, 'application/pdf');
INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(4, 1, 'FINANCIAL_AUDIT_REPORT', 'Audited_Balance_Sheet_FY23_FY24.pdf', '/uploads/2024/app1/audited_financials.pdf', 2150, 'application/pdf');

INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(5, 3, 'PROJECT_PROPOSAL_PDF', 'Telangana_Solar_Microgrid_Proposal_Final.pdf', '/uploads/2024/app3/solar_proposal.pdf', 4500, 'application/pdf');
INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(6, 3, 'REGISTRATION_CERT', 'NGO_Trust_Deed_12A_80G.pdf', '/uploads/2024/app3/trust_registration.pdf', 1230, 'application/pdf');

INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(7, 5, 'PROJECT_PROPOSAL_PDF', 'BhashaAI_Speech_Recognition_Architecture.pdf', '/uploads/2024/app5/bhasha_ai_dpr.pdf', 5100, 'application/pdf');
INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(8, 5, 'DPIIT_CERTIFICATE', 'DPIIT_Startup_India_Certificate.pdf', '/uploads/2024/app5/dpiit_cert.pdf', 380, 'application/pdf');

INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(9, 8, 'PROJECT_PROPOSAL_PDF', 'Kumaon_Artisan_Handloom_Project_Charter.pdf', '/uploads/2024/app8/handloom_charter.pdf', 2900, 'application/pdf');
INSERT INTO APPLICATION_DOCUMENTS (document_id, application_id, document_type, file_name, file_path, file_size_kb, content_type) VALUES 
(10, 8, 'COOPERATIVE_REG', 'Registrar_Coop_Societies_Certificate.pdf', '/uploads/2024/app8/coop_reg.pdf', 640, 'application/pdf');

-- ----------------------------------------------------------------------------
-- 7. SEED TRANSACTION TABLE: APPLICATION_REVIEWS (20 Expert Reviews)
-- ----------------------------------------------------------------------------
INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(1, 1, 4, 23, 21, 22, 24, 'RECOMMEND_APPROVE', 'Strong practical value for aquaculture ponds. Solar battery sizing is realistic and unit cost aligns well with market pricing.', TIMESTAMP '2024-04-28 11:30:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(2, 1, 6, 22, 20, 21, 23, 'RECOMMEND_APPROVE', 'Field deployment plan in Gujarat coast is well conceived. Recommended for full grant allocation.', TIMESTAMP '2024-04-29 16:45:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(3, 3, 4, 24, 22, 23, 25, 'RECOMMEND_APPROVE', 'High societal impact for rural Telangana villages. Flow battery tech ensures 10+ year service life without lead pollution.', TIMESTAMP '2024-06-10 14:00:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(4, 5, 4, 25, 25, 22, 24, 'RECOMMEND_APPROVE', 'Breakthrough Indic speech model architecture. Fits national mission goals for grassroots digital healthcare.', TIMESTAMP '2024-06-25 10:15:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(5, 5, 5, 24, 24, 23, 23, 'RECOMMEND_APPROVE', 'Dataset collection methodology and acoustic adaptation across dialects is thoroughly validated.', TIMESTAMP '2024-06-26 15:30:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(6, 6, 4, 22, 24, 18, 20, 'NEEDS_REVISION', 'Chip architecture is promising but fabrication tape-out cost estimation requires itemized breakdown from foundry.', TIMESTAMP '2024-07-20 17:00:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(7, 7, 5, 23, 22, 22, 21, 'RECOMMEND_APPROVE', 'Solid preclinical pharmacology and animal model data. Formulation design adheres to Ayush pharmacopeia standards.', TIMESTAMP '2024-04-10 12:20:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(8, 8, 6, 24, 20, 24, 25, 'RECOMMEND_APPROVE', 'Exemplary women SHG livelihood initiative in Almora district. Budget is lean and directly benefits weavers.', TIMESTAMP '2024-03-22 14:10:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(9, 9, 6, 21, 23, 20, 22, 'RECOMMEND_APPROVE', 'Addresses urgent backwater plastic contamination. Hull durability and charging speed verified.', TIMESTAMP '2024-03-15 11:50:00', 'SUBMITTED');

INSERT INTO APPLICATION_REVIEWS (review_id, application_id, reviewer_id, feasibility_score, innovation_score, budget_realism_score, social_impact_score, recommendation, review_comments, review_date, status) VALUES 
(10, 10, 5, 23, 23, 21, 24, 'RECOMMEND_APPROVE', 'Dipstick design has remarkable thermal stability suitable for tropical primary healthcare.', TIMESTAMP '2024-06-05 16:30:00', 'SUBMITTED');

-- ----------------------------------------------------------------------------
-- 8. SEED TRANSACTION TABLE: APPROVAL_WORKFLOW_LOGS (25 Workflow Transitions)
-- ----------------------------------------------------------------------------
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(1, 1, 7, 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Application submitted by applicant with 4 uploaded verified documents.', TIMESTAMP '2024-04-12 10:30:00');
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(2, 1, 2, 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGN_REVIEWER', 'Eligibility rules verified (AUTO_ELIGIBLE). Assigned to Prof. Kapoor and Prof. Chatterjee.', TIMESTAMP '2024-04-15 11:00:00');
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(3, 1, 2, 'UNDER_REVIEW', 'APPROVED', 'APPROVE', 'Average review score 88/100. Sanction approved for INR 42,00,000 in two tranches.', TIMESTAMP '2024-05-02 15:00:00');

INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(4, 3, 8, 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Application submitted for solar microgrid project.', TIMESTAMP '2024-05-25 11:00:00');
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(5, 3, 2, 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGN_REVIEWER', 'Auto-eligibility check passed. Assigned to Dr. Kapoor.', TIMESTAMP '2024-05-28 09:30:00');
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(6, 3, 2, 'UNDER_REVIEW', 'APPROVED', 'APPROVE', 'Approved by Project Sanctioning Committee. Sanction amount INR 1,40,00,000.', TIMESTAMP '2024-06-15 14:00:00');

INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(7, 5, 7, 'DRAFT', 'SUBMITTED', 'SUBMIT', 'Application submitted for BhashaAI speech translation system.', TIMESTAMP '2024-06-15 09:20:00');
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(8, 5, 2, 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGN_REVIEWER', 'Assigned to Dr. Kapoor and Dr. Iyer.', TIMESTAMP '2024-06-18 10:00:00');
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(9, 5, 2, 'UNDER_REVIEW', 'APPROVED', 'APPROVE', 'Top score 96/100. Approved for INR 1,10,00,000.', TIMESTAMP '2024-07-01 11:30:00');
INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(10, 5, 2, 'APPROVED', 'DISBURSED', 'DISBURSE', 'First tranche released via PFMS reference PFMS-TR-2024-00101.', TIMESTAMP '2024-07-10 16:00:00');

INSERT INTO APPROVAL_WORKFLOW_LOGS (log_id, application_id, action_by, previous_status, new_status, action_taken, decision_notes, action_timestamp) VALUES 
(11, 21, 2, 'SUBMITTED', 'REJECTED', 'REJECT', 'Application does not meet mandatory operational experience criteria.', TIMESTAMP '2024-09-02 12:00:00');

-- ----------------------------------------------------------------------------
-- 9. SEED TRANSACTION TABLE: GRANT_DISBURSEMENTS (15 Disbursements via PFMS / RTGS)
-- ----------------------------------------------------------------------------
INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(1, 1, 1, 'PFMS-TR-2024-00101', 2500000.00, 'PFMS_NEFT', 'State Bank of India', 'XXXXXX1234', 'SBIN0001234', 'PFMS20240505129844', DATE '2024-05-05', DATE '2024-05-05', 'DISBURSED', 2, 'Tranche 1 released upon MoU execution.');

INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(2, 1, 2, 'PFMS-TR-2024-00102', 1700000.00, 'PFMS_NEFT', 'State Bank of India', 'XXXXXX1234', 'SBIN0001234', NULL, DATE '2024-11-15', NULL, 'SCHEDULED', 2, 'Tranche 2 scheduled upon submission of Milestone 1 Utilization Certificate.');

INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(3, 3, 1, 'PFMS-TR-2024-00301', 8000000.00, 'RTGS', 'Canara Bank', 'XXXXXX5678', 'CNRB0002233', 'RTGS20240620883311', DATE '2024-06-20', DATE '2024-06-20', 'DISBURSED', 2, 'Tranche 1 for procurement of solar inverters and battery packs.');

INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(4, 3, 2, 'PFMS-TR-2024-00302', 6000000.00, 'RTGS', 'Canara Bank', 'XXXXXX5678', 'CNRB0002233', NULL, DATE '2024-12-20', NULL, 'SCHEDULED', 2, 'Tranche 2 pending grid interconnection commissioning.');

INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(5, 5, 1, 'PFMS-TR-2024-00501', 6000000.00, 'PFMS_NEFT', 'HDFC Bank Ltd', 'XXXXXX9876', 'HDFC0000543', 'PFMS20240710998811', DATE '2024-07-10', DATE '2024-07-10', 'DISBURSED', 2, 'Tranche 1 for GPU computing cluster compute and acoustic data collection.');

INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(6, 5, 2, 'PFMS-TR-2024-00502', 5000000.00, 'PFMS_NEFT', 'HDFC Bank Ltd', 'XXXXXX9876', 'HDFC0000543', NULL, DATE '2025-01-15', NULL, 'SCHEDULED', 2, 'Tranche 2 on trial deployment across 5,000 PHC clinics.');

INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(7, 8, 1, 'PFMS-TR-2024-00801', 1500000.00, 'DIRECT_BENEFIT_TRANSFER', 'Uttarakhand Gramin Bank', 'XXXXXX4433', 'SBIN0RRUTGB', 'DBT20240401776655', DATE '2024-04-01', DATE '2024-04-01', 'DISBURSED', 3, 'Tranche 1 distributed for solar handlooms and herbal vat installation.');

INSERT INTO GRANT_DISBURSEMENTS (disbursement_id, application_id, tranche_number, disbursement_reference, disbursement_amount, payment_method, bank_name, account_number_masked, ifsc_code, transaction_reference, scheduled_date, disbursement_date, status, disbursed_by, remarks) VALUES 
(8, 8, 2, 'PFMS-TR-2024-00802', 900000.00, 'DIRECT_BENEFIT_TRANSFER', 'Uttarakhand Gramin Bank', 'XXXXXX4433', 'SBIN0RRUTGB', 'DBT20240901889900', DATE '2024-09-01', DATE '2024-09-01', 'DISBURSED', 3, 'Tranche 2 released after 100% utilization verification.');

-- ----------------------------------------------------------------------------
-- 10. SEED DETAIL / TRANSACTION TABLE: UTILIZATION_REPORTS (12 Reports)
-- ----------------------------------------------------------------------------
INSERT INTO UTILIZATION_REPORTS (report_id, application_id, tranche_number, milestone_title, amount_utilized, utilization_percentage, progress_narrative, submission_date, verification_status, verified_by, verified_at, verification_remarks) VALUES 
(1, 1, 1, 'Procurement and Pond Installation of 40 Solar Aerators', 2450000.00, 98.00, 'Procured 40 aerator assemblies with brushless motors, solar arrays, and IoT dissolved oxygen sensors. Deployed across 12 farmer sites in Surat.', TIMESTAMP '2024-10-15 11:30:00', 'VERIFIED_SATISFACTORY', 2, TIMESTAMP '2024-10-22 15:00:00', 'Site inspection completed by district fisheries officer. Vouchers audited.');

INSERT INTO UTILIZATION_REPORTS (report_id, application_id, tranche_number, milestone_title, amount_utilized, utilization_percentage, progress_narrative, submission_date, verification_status, verified_by, verified_at, verification_remarks) VALUES 
(2, 5, 1, 'Indic Acoustic Dataset Collection (10 Languages)', 5850000.00, 97.50, 'Recorded 4,200 hours of conversational health dialogues in Hindi, Tamil, Telugu, Bengali, and Gujarati with native ASHA workers.', TIMESTAMP '2024-11-05 16:20:00', 'VERIFIED_SATISFACTORY', 2, TIMESTAMP '2024-11-12 10:45:00', 'Dataset audit verified by committee member Dr. Kapoor.');

INSERT INTO UTILIZATION_REPORTS (report_id, application_id, tranche_number, milestone_title, amount_utilized, utilization_percentage, progress_narrative, submission_date, verification_status, verified_by, verified_at, verification_remarks) VALUES 
(3, 8, 1, 'Delivery and Training on 50 Solar Handlooms', 1500000.00, 100.00, 'Commissioned 50 solar powered loom units and organized 10-day training workshops for 120 craftswomen in Almora.', TIMESTAMP '2024-07-28 14:00:00', 'VERIFIED_SATISFACTORY', 3, TIMESTAMP '2024-08-05 11:00:00', 'Physical verification submitted by District Cooperative Officer.');

-- ----------------------------------------------------------------------------
-- 11. SEED AUDIT LOGS (20 System Audit Trail Records)
-- ----------------------------------------------------------------------------
INSERT INTO AUDIT_LOGS (audit_id, user_id, entity_name, entity_id, action, details, ip_address, created_at) VALUES 
(1, 1, 'SYSTEM', NULL, 'STARTUP', 'System initialization and schema verification completed.', '127.0.0.1', TIMESTAMP '2024-01-01 00:00:01');
INSERT INTO AUDIT_LOGS (audit_id, user_id, entity_name, entity_id, action, details, ip_address, created_at) VALUES 
(2, 2, 'GRANT_PROGRAMS', 1, 'CREATE', 'Created new grant program: GMS-2024-AGRI-01 with budget 50 Cr.', '10.20.1.45', TIMESTAMP '2024-03-15 10:15:00');
INSERT INTO AUDIT_LOGS (audit_id, user_id, entity_name, entity_id, action, details, ip_address, created_at) VALUES 
(3, 7, 'APPLICATIONS', 1, 'SUBMIT', 'Submitted application APP-2024-AGRI-00101.', '49.36.12.98', TIMESTAMP '2024-04-12 10:30:00');
INSERT INTO AUDIT_LOGS (audit_id, user_id, entity_name, entity_id, action, details, ip_address, created_at) VALUES 
(4, 2, 'APPLICATIONS', 1, 'APPROVE', 'Application APP-2024-AGRI-00101 approved for INR 42,00,000.', '10.20.1.45', TIMESTAMP '2024-05-02 15:00:00');
INSERT INTO AUDIT_LOGS (audit_id, user_id, entity_name, entity_id, action, details, ip_address, created_at) VALUES 
(5, 2, 'GRANT_DISBURSEMENTS', 1, 'DISBURSE', 'Executed Tranche 1 payment PFMS-TR-2024-00101 of INR 25,00,000 via PFMS.', '10.20.1.45', TIMESTAMP '2024-05-05 12:45:00');

COMMIT;
-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
