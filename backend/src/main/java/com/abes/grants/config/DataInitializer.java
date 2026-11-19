package com.abes.grants.config;

import com.abes.grants.model.*;
import com.abes.grants.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final GrantProgramRepository programRepository;
    private final ProgramEligibilityCriterionRepository criterionRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationReviewRepository reviewRepository;
    private final ApprovalWorkflowLogRepository workflowLogRepository;
    private final GrantDisbursementRepository disbursementRepository;
    private final UtilizationReportRepository utilizationReportRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           GrantProgramRepository programRepository,
                           ProgramEligibilityCriterionRepository criterionRepository,
                           ApplicationRepository applicationRepository,
                           ApplicationReviewRepository reviewRepository,
                           ApprovalWorkflowLogRepository workflowLogRepository,
                           GrantDisbursementRepository disbursementRepository,
                           UtilizationReportRepository utilizationReportRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.criterionRepository = criterionRepository;
        this.applicationRepository = applicationRepository;
        this.reviewRepository = reviewRepository;
        this.workflowLogRepository = workflowLogRepository;
        this.disbursementRepository = disbursementRepository;
        this.utilizationReportRepository = utilizationReportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Initialize Roles
        Role adminRole = roleRepository.save(new Role("ROLE_ADMIN", "System Administrator", "Platform administrative access"));
        Role officerRole = roleRepository.save(new Role("ROLE_PROGRAM_OFFICER", "Program Officer", "Configures grant programs and sanctions"));
        Role reviewerRole = roleRepository.save(new Role("ROLE_REVIEWER", "Evaluation Committee / Reviewer", "Reviews and scores proposals"));
        Role applicantRole = roleRepository.save(new Role("ROLE_APPLICANT", "Grant Applicant", "Submits proposals and tracks disbursements"));

        String hash = passwordEncoder.encode("Password@123");

        // 2. Initialize Users
        User admin = createUser("admin", hash, "Rajesh K. Verma", "admin.grants@gov.in", "+91 98101 23456", "Ministry of Finance / NIC", "Director IT", adminRole);
        User officerSharma = createUser("officer_sharma", hash, "Sunita Sharma", "sunita.sharma@dst.gov.in", "+91 98200 45678", "Department of Science and Technology", "Senior Program Officer", officerRole);
        User officerNair = createUser("officer_nair", hash, "Anand Nair", "anand.nair@agri.gov.in", "+91 98311 98765", "Ministry of Agriculture", "Joint Director Grants", officerRole);
        User revKapoor = createUser("reviewer_kapoor", hash, "Dr. Alok Kapoor", "alok.kapoor@iitd.ac.in", "+91 98765 11223", "IIT Delhi - Dept of Electrical Engg", "Professor & External Reviewer", reviewerRole);
        User revIyer = createUser("reviewer_iyer", hash, "Dr. Meenakshi Iyer", "m.iyer@iisc.ac.in", "+91 99887 33445", "IISc Bangalore", "Principal Investigator", reviewerRole);
        User appPatel = createUser("applicant_patel", hash, "Chirag Patel", "chirag@krishiai-tech.com", "+91 99099 87654", "KrishiAI Technologies Pvt Ltd", "Chief Technology Officer", applicantRole);
        User appReddy = createUser("applicant_reddy", hash, "Kavitha Reddy", "kavitha@telangana-solarlabs.org", "+91 98490 12345", "Surya Shakti Solar NGO", "Managing Trustee", applicantRole);
        User appSingh = createUser("applicant_singh", hash, "Harpreet Singh", "harpreet@punjabhyrdo.in", "+91 98150 44332", "Green Harvest Hydroponics LLP", "Founder & Director", applicantRole);
        User appJoshi = createUser("applicant_joshi", hash, "Pooja Joshi", "pooja@himalayancrafts.org", "+91 94120 55667", "Uttarakhand Weavers Cooperative Union", "Secretary", applicantRole);

        // 3. Initialize Grant Programs
        GrantProgram p1 = createProgram("GMS-2024-AGRI-01", "PM Matsya Sampada Aquaculture Tech Grant",
                "Agriculture & Fisheries", "Ministry of Fisheries, Animal Husbandry & Dairying",
                "Financial grant for commercializing smart aeration, IoT-based water quality sensors and sustainable feed production.",
                new BigDecimal("50000000.00"), new BigDecimal("14500000.00"),
                new BigDecimal("1000000.00"), new BigDecimal("7500000.00"),
                LocalDate.of(2024, 4, 1), LocalDate.of(2025, 3, 31), "ACTIVE",
                "MSMEs or Startups registered in India with min 2 years operational record in fisheries.", officerSharma);

        createCriterion(p1, "MIN_OPERATING_YEARS", "Minimum Years in Operation", "NUMERIC_MIN", "2", "Y", 25);
        createCriterion(p1, "MAX_TURNOVER_CRORES", "Maximum Annual Turnover (INR Crores)", "NUMERIC_MAX", "50", "N", 15);
        createCriterion(p1, "ENTITY_TYPE_ALLOWED", "Permissible Legal Entity Type", "IN_LIST", "Startup,MSME,Cooperative Society,LLP", "Y", 30);
        createCriterion(p1, "GST_REGISTRATION", "Valid GST Registration Required", "BOOLEAN", "TRUE", "Y", 30);

        GrantProgram p2 = createProgram("GMS-2024-CLEAN-02", "National Clean Energy Solar Innovation Grant",
                "Clean Energy", "Ministry of New and Renewable Energy",
                "Catalytic funding for high-efficiency bifacial perovskite solar cells, micro-inverters, and decentralized agrivoltaics.",
                new BigDecimal("120000000.00"), new BigDecimal("42000000.00"),
                new BigDecimal("2500000.00"), new BigDecimal("20000000.00"),
                LocalDate.of(2024, 5, 15), LocalDate.of(2025, 11, 30), "ACTIVE",
                "Indian Private Limited companies or Academic Labs. Minimum annual turnover of INR 50 Lakhs.", officerSharma);

        createCriterion(p2, "MIN_OPERATING_YEARS", "Minimum Years in Operation", "NUMERIC_MIN", "3", "Y", 20);
        createCriterion(p2, "MIN_TURNOVER_LAKHS", "Minimum Annual Turnover (INR Lakhs)", "NUMERIC_MIN", "50", "Y", 30);
        createCriterion(p2, "GST_REGISTRATION", "Valid GST Registration Required", "BOOLEAN", "TRUE", "Y", 50);

        GrantProgram p3 = createProgram("GMS-2024-TECH-03", "Digital India AI & Cybersecurity Challenge Grant",
                "Technology & Innovation", "Ministry of Electronics and Information Technology (MeitY)",
                "Grant for development of indigenous foundational language models for 22 scheduled Indian languages and sovereign cyber defense tools.",
                new BigDecimal("85000000.00"), new BigDecimal("28000000.00"),
                new BigDecimal("5000000.00"), new BigDecimal("15000000.00"),
                LocalDate.of(2024, 6, 1), LocalDate.of(2025, 12, 31), "ACTIVE",
                "DPIIT-recognized Startups with Indian resident majority shareholding and functional prototype.", officerSharma);

        createCriterion(p3, "MIN_OPERATING_YEARS", "Minimum Years in Operation", "NUMERIC_MIN", "1", "Y", 30);
        createCriterion(p3, "ENTITY_TYPE_ALLOWED", "Permissible Legal Entity Type", "IN_LIST", "Startup,MSME", "Y", 40);
        createCriterion(p3, "GST_REGISTRATION", "Valid GST Registration Required", "BOOLEAN", "TRUE", "Y", 30);

        GrantProgram p4 = createProgram("GMS-2024-WOMEN-05", "Rural Women Artisan Digital Livelihood Grant",
                "Women Entrepreneurship", "Ministry of Rural Development",
                "Support for women-led SHGs and handloom cooperatives for digital marketplace integration, packaging design, and export compliance.",
                new BigDecimal("25000000.00"), new BigDecimal("6000000.00"),
                new BigDecimal("500000.00"), new BigDecimal("3000000.00"),
                LocalDate.of(2024, 2, 15), LocalDate.of(2025, 6, 30), "ACTIVE",
                "Cooperative societies or registered NGOs with at least 70% women members.", officerNair);

        createCriterion(p4, "MIN_OPERATING_YEARS", "Minimum Years in Operation", "NUMERIC_MIN", "2", "Y", 50);
        createCriterion(p4, "GST_REGISTRATION", "Valid GST Registration Required", "BOOLEAN", "TRUE", "Y", 50);

        // 4. Initialize Applications
        Application app1 = createApplication("APP-2024-AGRI-00101", p1, appPatel,
                "Smart IoT AquaAerator for Freshwater Prawns",
                "Deployment of solar-assisted automatic oxygenators with pH and turbidity monitoring in coastal aquaculture ponds.",
                new BigDecimal("4500000.00"), new BigDecimal("4200000.00"), 18,
                "600+ Fish Farmers in Surat and Bharuch", "Gujarat", "Surat", "Startup",
                "AAACK1234F", "24AAACK1234F1Z8", new BigDecimal("12000000.00"), 3,
                "AUTO_ELIGIBLE", "All mandatory criteria satisfied: 3 yrs active, valid GST.",
                "APPROVED", LocalDateTime.of(2024, 4, 12, 10, 30));

        Application app2 = createApplication("APP-2024-CLEAN-00201", p2, appReddy,
                "Community Solar Microgrid with Flow Batteries",
                "Deploying 50kW agro-photovoltaic micro-grids powering irrigation pumps and rural micro-cold storages.",
                new BigDecimal("15000000.00"), new BigDecimal("14000000.00"), 24,
                "4 Village Panchayats (3,200 villagers)", "Telangana", "Warangal", "NGO / Trust",
                "AAATG9988D", "36AAATG9988D1ZC", new BigDecimal("6500000.00"), 5,
                "AUTO_ELIGIBLE", "Turnover and experience criteria verified.",
                "APPROVED", LocalDateTime.of(2024, 5, 25, 11, 0));

        Application app3 = createApplication("APP-2024-TECH-00301", p3, appPatel,
                "BhashaAI: Multilingual Speech-to-Speech Engine for Rural Health",
                "Speech recognition and translation for 10 Indic languages enabling ASHA health workers to capture patient notes.",
                new BigDecimal("12000000.00"), new BigDecimal("11000000.00"), 18,
                "25,000+ Primary Healthcare Centers", "Karnataka", "Bengaluru Urban", "Startup",
                "AAACK1234F", "29AAACK1234F1Z1", new BigDecimal("14000000.00"), 3,
                "AUTO_ELIGIBLE", "Full eligibility confirmed.",
                "DISBURSED", LocalDateTime.of(2024, 6, 15, 9, 20));

        Application app4 = createApplication("APP-2024-WOMEN-00501", p4, appJoshi,
                "Natural Dye Kumaoni Tweed Handloom Cluster Digitalization",
                "Setting up automated inventory scanning, natural vegetable dye lab and direct-to-consumer digital portal for 300 hill weavers.",
                new BigDecimal("2500000.00"), new BigDecimal("2400000.00"), 12,
                "350 Women Hill Artisans", "Uttarakhand", "Almora", "Cooperative Society",
                "AAACU7766M", "05AAACU7766M1ZX", new BigDecimal("3500000.00"), 6,
                "AUTO_ELIGIBLE", "84% women membership, rural cluster certified.",
                "DISBURSED", LocalDateTime.of(2024, 3, 5, 13, 10));

        Application app5 = createApplication("APP-2024-AGRI-00102", p1, appSingh,
                "Cold-Water Trout Recirculatory Aquaculture System (RAS)",
                "Establishing energy-efficient indoor recirculatory tank systems for high-altitude trout cultivation in Mandi district.",
                new BigDecimal("6000000.00"), null, 24,
                "150 Mountain Farmers", "Himachal Pradesh", "Mandi", "MSME",
                "AABCG5543K", "02AABCG5543K1Z2", new BigDecimal("8500000.00"), 4,
                "AUTO_ELIGIBLE", "Meets operational age, registered MSME.",
                "UNDER_REVIEW", LocalDateTime.of(2024, 4, 20, 14, 15));

        // 5. Initialize Reviews
        createReview(app1, revKapoor, 23, 21, 22, 24, "RECOMMEND_APPROVE", "Strong practical value for aquaculture ponds. Highly viable.", "SUBMITTED");
        createReview(app2, revKapoor, 24, 22, 23, 25, "RECOMMEND_APPROVE", "High societal impact for rural Telangana villages.", "SUBMITTED");
        createReview(app3, revKapoor, 25, 25, 22, 24, "RECOMMEND_APPROVE", "Breakthrough Indic speech model architecture.", "SUBMITTED");
        createReview(app3, revIyer, 24, 24, 23, 23, "RECOMMEND_APPROVE", "Dataset collection methodology verified.", "SUBMITTED");
        createReview(app5, revIyer, 20, 20, 19, 21, "RECOMMEND_APPROVE", "Good trout RAS methodology for high altitude.", "SUBMITTED");

        // 6. Initialize Disbursements
        createDisbursement(app1, 1, "PFMS-TR-2024-00101", new BigDecimal("2500000.00"), "PFMS_NEFT",
                "State Bank of India", "XXXXXX1234", "SBIN0001234", "PFMS20240505129844",
                LocalDate.of(2024, 5, 5), LocalDate.of(2024, 5, 5), "DISBURSED", officerSharma, "Tranche 1 released upon MoU execution.");

        createDisbursement(app1, 2, "PFMS-TR-2024-00102", new BigDecimal("1700000.00"), "PFMS_NEFT",
                "State Bank of India", "XXXXXX1234", "SBIN0001234", null,
                LocalDate.of(2024, 11, 15), null, "SCHEDULED", officerSharma, "Tranche 2 scheduled upon UC verification.");

        createDisbursement(app3, 1, "PFMS-TR-2024-00501", new BigDecimal("6000000.00"), "PFMS_NEFT",
                "HDFC Bank Ltd", "XXXXXX9876", "HDFC0000543", "PFMS20240710998811",
                LocalDate.of(2024, 7, 10), LocalDate.of(2024, 7, 10), "DISBURSED", officerSharma, "Tranche 1 for GPU computing cluster compute.");

        createDisbursement(app4, 1, "PFMS-TR-2024-00801", new BigDecimal("1500000.00"), "DIRECT_BENEFIT_TRANSFER",
                "Uttarakhand Gramin Bank", "XXXXXX4433", "SBIN0RRUTGB", "DBT20240401776655",
                LocalDate.of(2024, 4, 1), LocalDate.of(2024, 4, 1), "DISBURSED", officerNair, "Tranche 1 for solar handlooms.");

        // 7. Initialize Utilization Reports
        createUtilizationReport(app1, 1, "Procurement and Pond Installation of 40 Solar Aerators",
                new BigDecimal("2450000.00"), new BigDecimal("98.00"),
                "Procured 40 aerator assemblies with brushless motors, solar arrays, and IoT sensors.",
                "VERIFIED_SATISFACTORY", officerSharma, "Site inspection completed by district fisheries officer.");

        createUtilizationReport(app3, 1, "Indic Acoustic Dataset Collection (10 Languages)",
                new BigDecimal("5850000.00"), new BigDecimal("97.50"),
                "Recorded 4,200 hours of conversational health dialogues in Hindi, Tamil, Telugu, and Gujarati.",
                "VERIFIED_SATISFACTORY", officerSharma, "Dataset audit verified.");

        // 8. Initialize Workflow Logs
        createWorkflowLog(app1, officerSharma, "UNDER_REVIEW", "APPROVED", "APPROVE", "Average review score 88/100. Sanction approved for INR 42,00,000.");
        createWorkflowLog(app3, officerSharma, "APPROVED", "DISBURSED", "DISBURSE", "First tranche released via PFMS reference PFMS-TR-2024-00501.");
    }

    private User createUser(String username, String hash, String name, String email, String phone, String org, String desig, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setPasswordHash(hash);
        u.setFullName(name);
        u.setEmail(email);
        u.setPhoneNumber(phone);
        u.setOrganizationName(org);
        u.setDesignation(desig);
        u.setRole(role);
        u.setStatus("ACTIVE");
        return userRepository.save(u);
    }

    private GrantProgram createProgram(String code, String title, String category, String agency, String desc,
                                       BigDecimal budget, BigDecimal disb, BigDecimal minG, BigDecimal maxG,
                                       LocalDate sDate, LocalDate eDate, String status, String elig, User creator) {
        GrantProgram p = new GrantProgram();
        p.setProgramCode(code);
        p.setTitle(title);
        p.setCategory(category);
        p.setFundingAgency(agency);
        p.setDescription(desc);
        p.setTotalBudget(budget);
        p.setDisbursedBudget(disb);
        p.setMinGrantAmount(minG);
        p.setMaxGrantAmount(maxG);
        p.setStartDate(sDate);
        p.setEndDate(eDate);
        p.setStatus(status);
        p.setEligibilitySummary(elig);
        p.setCreatedBy(creator);
        return programRepository.save(p);
    }

    private void createCriterion(GrantProgram p, String code, String name, String type, String expected, String mand, int weight) {
        ProgramEligibilityCriterion c = new ProgramEligibilityCriterion();
        c.setProgram(p);
        c.setCriterionCode(code);
        c.setCriterionName(name);
        c.setCriterionType(type);
        c.setExpectedValue(expected);
        c.setIsMandatory(mand);
        c.setWeightage(weight);
        criterionRepository.save(c);
    }

    private Application createApplication(String number, GrantProgram p, User applicant, String title, String summary,
                                          BigDecimal requested, BigDecimal approved, int duration, String ben,
                                          String state, String dist, String orgType, String pan, String gstin,
                                          BigDecimal turnover, int years, String eligStatus, String remarks,
                                          String status, LocalDateTime sDate) {
        Application a = new Application();
        a.setApplicationNumber(number);
        a.setProgram(p);
        a.setApplicant(applicant);
        a.setProjectTitle(title);
        a.setProjectSummary(summary);
        a.setRequestedAmount(requested);
        a.setApprovedAmount(approved);
        a.setProjectDurationMonths(duration);
        a.setTargetBeneficiaries(ben);
        a.setStateOrRegion(state);
        a.setDistrict(dist);
        a.setOrganizationType(orgType);
        a.setOrganizationPan(pan);
        a.setOrganizationGstin(gstin);
        a.setAnnualTurnover(turnover);
        a.setYearsInOperation(years);
        a.setEligibilityStatus(eligStatus);
        a.setEligibilityRemarks(remarks);
        a.setStatus(status);
        a.setSubmissionDate(sDate);
        return applicationRepository.save(a);
    }

    private void createReview(Application app, User reviewer, int f, int in, int b, int s, String rec, String comments, String status) {
        ApplicationReview r = new ApplicationReview();
        r.setApplication(app);
        r.setReviewer(reviewer);
        r.setFeasibilityScore(f);
        r.setInnovationScore(in);
        r.setBudgetRealismScore(b);
        r.setSocialImpactScore(s);
        r.setRecommendation(rec);
        r.setReviewComments(comments);
        r.setStatus(status);
        r.recalculateTotal();
        reviewRepository.save(r);
    }

    private void createDisbursement(Application app, int tranche, String ref, BigDecimal amt, String method,
                                    String bank, String acc, String ifsc, String txn, LocalDate sDate, LocalDate dDate,
                                    String status, User officer, String remarks) {
        GrantDisbursement d = new GrantDisbursement();
        d.setApplication(app);
        d.setTrancheNumber(tranche);
        d.setDisbursementReference(ref);
        d.setDisbursementAmount(amt);
        d.setPaymentMethod(method);
        d.setBankName(bank);
        d.setAccountNumberMasked(acc);
        d.setIfscCode(ifsc);
        d.setTransactionReference(txn);
        d.setScheduledDate(sDate);
        d.setDisbursementDate(dDate);
        d.setStatus(status);
        d.setDisbursedBy(officer);
        d.setRemarks(remarks);
        disbursementRepository.save(d);
    }

    private void createUtilizationReport(Application app, int tranche, String title, BigDecimal amt, BigDecimal pct,
                                         String narrative, String status, User officer, String remarks) {
        UtilizationReport u = new UtilizationReport();
        u.setApplication(app);
        u.setTrancheNumber(tranche);
        u.setMilestoneTitle(title);
        u.setAmountUtilized(amt);
        u.setUtilizationPercentage(pct);
        u.setProgressNarrative(narrative);
        u.setVerificationStatus(status);
        u.setVerifiedBy(officer);
        u.setVerifiedAt(LocalDateTime.now());
        u.setVerificationRemarks(remarks);
        utilizationReportRepository.save(u);
    }

    private void createWorkflowLog(Application app, User actor, String prev, String next, String action, String notes) {
        ApprovalWorkflowLog log = new ApprovalWorkflowLog(app, actor, prev, next, action, notes);
        workflowLogRepository.save(log);
    }
}
