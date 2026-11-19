package com.abes.grants.service;

import com.abes.grants.dto.DTOs.ApplicationSubmitRequest;
import com.abes.grants.dto.DTOs.EligibilityCheckResult;
import com.abes.grants.model.*;
import com.abes.grants.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final GrantProgramRepository programRepository;
    private final UserRepository userRepository;
    private final ApprovalWorkflowLogRepository workflowLogRepository;
    private final EligibilityEngineService eligibilityEngineService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              GrantProgramRepository programRepository,
                              UserRepository userRepository,
                              ApprovalWorkflowLogRepository workflowLogRepository,
                              EligibilityEngineService eligibilityEngineService) {
        this.applicationRepository = applicationRepository;
        this.programRepository = programRepository;
        this.userRepository = userRepository;
        this.workflowLogRepository = workflowLogRepository;
        this.eligibilityEngineService = eligibilityEngineService;
    }

    public List<Application> getApplications(Long programId, Long applicantId, String status) {
        if (programId != null) {
            return applicationRepository.findByProgram_ProgramId(programId);
        } else if (applicantId != null) {
            return applicationRepository.findByApplicant_UserId(applicantId);
        } else if (status != null && !status.isEmpty()) {
            return applicationRepository.findByStatus(status.toUpperCase());
        }
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));
    }

    @Transactional
    public Application submitApplication(ApplicationSubmitRequest request, String username) {
        User applicant = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Applicant user not found: " + username));

        GrantProgram program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found with ID: " + request.getProgramId()));

        Application app = new Application();
        String dateSuffix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randSuffix = String.format("%04d", (int)(Math.random() * 9000) + 1000);
        app.setApplicationNumber("APP-" + dateSuffix + "-" + randSuffix);
        app.setProgram(program);
        app.setApplicant(applicant);
        app.setProjectTitle(request.getProjectTitle());
        app.setProjectSummary(request.getProjectSummary());
        app.setRequestedAmount(request.getRequestedAmount());
        app.setProjectDurationMonths(request.getProjectDurationMonths());
        app.setTargetBeneficiaries(request.getTargetBeneficiaries());
        app.setStateOrRegion(request.getStateOrRegion());
        app.setDistrict(request.getDistrict());
        app.setOrganizationType(request.getOrganizationType());
        app.setOrganizationPan(request.getOrganizationPan());
        app.setOrganizationGstin(request.getOrganizationGstin());
        app.setAnnualTurnover(request.getAnnualTurnover());
        app.setYearsInOperation(request.getYearsInOperation());
        app.setSubmissionDate(LocalDateTime.now());
        app.setStatus("SUBMITTED");
        app.setCreatedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());

        // Perform Automated Eligibility Engine Validation
        EligibilityCheckResult result = eligibilityEngineService.evaluateApplication(app, program);
        app.setEligibilityStatus(result.getStatus());
        app.setEligibilityRemarks(String.join("; ", result.getDetails()));

        Application saved = applicationRepository.save(app);

        // Record Initial Workflow Event
        ApprovalWorkflowLog log = new ApprovalWorkflowLog(
                saved, applicant, "DRAFT", "SUBMITTED", "SUBMIT",
                "Application submitted. Automated Eligibility Check: " + result.getStatus() +
                        " | Remarks: " + app.getEligibilityRemarks()
        );
        workflowLogRepository.save(log);

        return saved;
    }

    @Transactional
    public EligibilityCheckResult reevaluateEligibility(Long applicationId) {
        Application app = getApplicationById(applicationId);
        EligibilityCheckResult result = eligibilityEngineService.evaluateApplication(app, app.getProgram());
        app.setEligibilityStatus(result.getStatus());
        app.setEligibilityRemarks(String.join("; ", result.getDetails()));
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
        return result;
    }
}
