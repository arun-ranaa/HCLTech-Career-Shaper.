package com.abes.grants.controller;

import com.abes.grants.dto.DTOs.ApplicationSubmitRequest;
import com.abes.grants.dto.DTOs.AssignReviewerRequest;
import com.abes.grants.dto.DTOs.DecisionRequest;
import com.abes.grants.dto.DTOs.EligibilityCheckResult;
import com.abes.grants.dto.DTOs.ScheduleDisbursementRequest;
import com.abes.grants.dto.DTOs.SubmitUtilizationReportRequest;
import com.abes.grants.model.*;
import com.abes.grants.service.ApplicationService;
import com.abes.grants.service.DisbursementService;
import com.abes.grants.service.ReviewWorkflowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ReviewWorkflowService reviewWorkflowService;
    private final DisbursementService disbursementService;

    public ApplicationController(ApplicationService applicationService,
                                 ReviewWorkflowService reviewWorkflowService,
                                 DisbursementService disbursementService) {
        this.applicationService = applicationService;
        this.reviewWorkflowService = reviewWorkflowService;
        this.disbursementService = disbursementService;
    }

    @GetMapping
    public ResponseEntity<List<Application>> getApplications(
            @RequestParam(required = false) Long programId,
            @RequestParam(required = false) Long applicantId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(applicationService.getApplications(programId, applicantId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PostMapping
    public ResponseEntity<Application> submitApplication(@RequestBody ApplicationSubmitRequest request,
                                                         Authentication auth) {
        String username = auth != null ? auth.getName() : "applicant_patel";
        Application created = applicationService.submitApplication(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/evaluate-eligibility")
    public ResponseEntity<EligibilityCheckResult> reevaluateEligibility(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.reevaluateEligibility(id));
    }

    // --- Module 3: Review Assignment & Decision Endpoints ---
    @PostMapping("/{id}/assign-reviewer")
    public ResponseEntity<ApplicationReview> assignReviewer(@PathVariable Long id,
                                                           @RequestBody AssignReviewerRequest req,
                                                           Authentication auth) {
        String officer = auth != null ? auth.getName() : "officer_sharma";
        return ResponseEntity.ok(reviewWorkflowService.assignReviewer(id, req.getReviewerId(), officer));
    }

    @PostMapping("/{id}/decision")
    public ResponseEntity<Application> decideApplication(@PathVariable Long id,
                                                         @RequestBody DecisionRequest req,
                                                         Authentication auth) {
        String officer = auth != null ? auth.getName() : "officer_sharma";
        return ResponseEntity.ok(reviewWorkflowService.decideApplication(id, req, officer));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ApplicationReview>> getReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewWorkflowService.getReviewsForApplication(id));
    }

    @GetMapping("/{id}/workflow-history")
    public ResponseEntity<List<ApprovalWorkflowLog>> getWorkflowHistory(@PathVariable Long id) {
        return ResponseEntity.ok(reviewWorkflowService.getWorkflowLogs(id));
    }

    // --- Module 4: Disbursement & Utilization Endpoints ---
    @PostMapping("/{id}/disbursements")
    public ResponseEntity<GrantDisbursement> scheduleDisbursement(@PathVariable Long id,
                                                                  @RequestBody ScheduleDisbursementRequest req,
                                                                  Authentication auth) {
        String officer = auth != null ? auth.getName() : "officer_sharma";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(disbursementService.scheduleDisbursement(id, req, officer));
    }

    @GetMapping("/{id}/disbursements")
    public ResponseEntity<List<GrantDisbursement>> getDisbursements(@PathVariable Long id) {
        return ResponseEntity.ok(disbursementService.getDisbursements(id));
    }

    @PostMapping("/{id}/utilization-reports")
    public ResponseEntity<UtilizationReport> submitUtilizationReport(@PathVariable Long id,
                                                                    @RequestBody SubmitUtilizationReportRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(disbursementService.submitUtilizationReport(id, req));
    }

    @GetMapping("/{id}/utilization-reports")
    public ResponseEntity<List<UtilizationReport>> getUtilizationReports(@PathVariable Long id) {
        return ResponseEntity.ok(disbursementService.getUtilizationReports(id));
    }
}
