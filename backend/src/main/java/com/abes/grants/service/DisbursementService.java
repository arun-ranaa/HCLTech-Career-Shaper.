package com.abes.grants.service;

import com.abes.grants.dto.DTOs.ExecuteDisbursementRequest;
import com.abes.grants.dto.DTOs.ScheduleDisbursementRequest;
import com.abes.grants.dto.DTOs.SubmitUtilizationReportRequest;
import com.abes.grants.dto.DTOs.VerifyUtilizationReportRequest;
import com.abes.grants.model.*;
import com.abes.grants.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DisbursementService {

    private final GrantDisbursementRepository disbursementRepository;
    private final UtilizationReportRepository utilizationReportRepository;
    private final ApplicationRepository applicationRepository;
    private final GrantProgramRepository programRepository;
    private final UserRepository userRepository;
    private final ApprovalWorkflowLogRepository workflowLogRepository;

    public DisbursementService(GrantDisbursementRepository disbursementRepository,
                               UtilizationReportRepository utilizationReportRepository,
                               ApplicationRepository applicationRepository,
                               GrantProgramRepository programRepository,
                               UserRepository userRepository,
                               ApprovalWorkflowLogRepository workflowLogRepository) {
        this.disbursementRepository = disbursementRepository;
        this.utilizationReportRepository = utilizationReportRepository;
        this.applicationRepository = applicationRepository;
        this.programRepository = programRepository;
        this.userRepository = userRepository;
        this.workflowLogRepository = workflowLogRepository;
    }

    public List<GrantDisbursement> getDisbursements(Long applicationId) {
        if (applicationId != null) {
            return disbursementRepository.findByApplication_ApplicationId(applicationId);
        }
        return disbursementRepository.findAll();
    }

    @Transactional
    public GrantDisbursement scheduleDisbursement(Long applicationId, ScheduleDisbursementRequest req, String officerUsername) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));
        User officer = userRepository.findByUsername(officerUsername).orElse(null);

        GrantDisbursement d = new GrantDisbursement();
        d.setApplication(app);
        d.setTrancheNumber(req.getTrancheNumber() != null ? req.getTrancheNumber() : 1);
        String dateCode = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String rand = String.format("%04d", (int)(Math.random() * 9000) + 1000);
        d.setDisbursementReference("PFMS-TR-" + dateCode + "-" + rand);
        d.setDisbursementAmount(req.getDisbursementAmount());
        d.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "PFMS_NEFT");
        d.setBankName(req.getBankName());
        d.setAccountNumberMasked(req.getAccountNumberMasked());
        d.setIfscCode(req.getIfscCode());
        d.setScheduledDate(req.getScheduledDate() != null ? req.getScheduledDate() : LocalDate.now());
        d.setStatus("SCHEDULED");
        d.setDisbursedBy(officer);
        d.setRemarks(req.getRemarks());
        d.setCreatedAt(LocalDateTime.now());

        return disbursementRepository.save(d);
    }

    @Transactional
    public GrantDisbursement executeDisbursement(Long disbursementId, ExecuteDisbursementRequest req, String officerUsername) {
        GrantDisbursement d = disbursementRepository.findById(disbursementId)
                .orElseThrow(() -> new RuntimeException("Disbursement not found: " + disbursementId));
        User officer = userRepository.findByUsername(officerUsername).orElse(null);

        d.setStatus("DISBURSED");
        d.setTransactionReference(req.getTransactionReference());
        d.setDisbursementDate(req.getDisbursementDate() != null ? req.getDisbursementDate() : LocalDate.now());
        d.setDisbursedBy(officer);

        GrantDisbursement saved = disbursementRepository.save(d);

        // Update application status to DISBURSED
        Application app = d.getApplication();
        String prevStatus = app.getStatus();
        app.setStatus("DISBURSED");
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);

        // Update Grant Program disbursed budget tally
        GrantProgram program = app.getProgram();
        BigDecimal currentDisbursed = program.getDisbursedBudget() != null ? program.getDisbursedBudget() : BigDecimal.ZERO;
        program.setDisbursedBudget(currentDisbursed.add(d.getDisbursementAmount()));
        program.setUpdatedAt(LocalDateTime.now());
        programRepository.save(program);

        // Log Workflow Event
        ApprovalWorkflowLog log = new ApprovalWorkflowLog(
                app, officer, prevStatus, "DISBURSED", "DISBURSE",
                String.format("Disbursed Tranche %d of INR %s via PFMS Reference %s (Txn: %s)",
                        d.getTrancheNumber(), d.getDisbursementAmount(), d.getDisbursementReference(), d.getTransactionReference())
        );
        workflowLogRepository.save(log);

        return saved;
    }

    @Transactional
    public UtilizationReport submitUtilizationReport(Long applicationId, SubmitUtilizationReportRequest req) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        UtilizationReport report = new UtilizationReport();
        report.setApplication(app);
        report.setTrancheNumber(req.getTrancheNumber());
        report.setMilestoneTitle(req.getMilestoneTitle());
        report.setAmountUtilized(req.getAmountUtilized());
        report.setUtilizationPercentage(req.getUtilizationPercentage());
        report.setProgressNarrative(req.getProgressNarrative());
        report.setSubmissionDate(LocalDateTime.now());
        report.setVerificationStatus("PENDING_VERIFICATION");

        return utilizationReportRepository.save(report);
    }

    @Transactional
    public UtilizationReport verifyUtilizationReport(Long reportId, VerifyUtilizationReportRequest req, String officerUsername) {
        UtilizationReport report = utilizationReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));
        User officer = userRepository.findByUsername(officerUsername).orElse(null);

        report.setVerificationStatus(req.getVerificationStatus());
        report.setVerificationRemarks(req.getVerificationRemarks());
        report.setVerifiedBy(officer);
        report.setVerifiedAt(LocalDateTime.now());

        return utilizationReportRepository.save(report);
    }

    public List<UtilizationReport> getUtilizationReports(Long applicationId) {
        if (applicationId != null) {
            return utilizationReportRepository.findByApplication_ApplicationId(applicationId);
        }
        return utilizationReportRepository.findAll();
    }
}
