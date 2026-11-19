package com.abes.grants.controller;

import com.abes.grants.dto.DTOs.ExecuteDisbursementRequest;
import com.abes.grants.dto.DTOs.VerifyUtilizationReportRequest;
import com.abes.grants.model.GrantDisbursement;
import com.abes.grants.model.UtilizationReport;
import com.abes.grants.service.DisbursementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class DisbursementController {

    private final DisbursementService disbursementService;

    public DisbursementController(DisbursementService disbursementService) {
        this.disbursementService = disbursementService;
    }

    @GetMapping("/disbursements")
    public ResponseEntity<List<GrantDisbursement>> getAllDisbursements(
            @RequestParam(required = false) Long applicationId) {
        return ResponseEntity.ok(disbursementService.getDisbursements(applicationId));
    }

    @PostMapping("/disbursements/{id}/execute")
    public ResponseEntity<GrantDisbursement> executeDisbursement(
            @PathVariable Long id,
            @RequestBody ExecuteDisbursementRequest req,
            Authentication auth) {
        String officer = auth != null ? auth.getName() : "officer_sharma";
        return ResponseEntity.ok(disbursementService.executeDisbursement(id, req, officer));
    }

    @GetMapping("/utilization-reports")
    public ResponseEntity<List<UtilizationReport>> getAllUtilizationReports(
            @RequestParam(required = false) Long applicationId) {
        return ResponseEntity.ok(disbursementService.getUtilizationReports(applicationId));
    }

    @PatchMapping("/utilization-reports/{id}/verify")
    public ResponseEntity<UtilizationReport> verifyUtilizationReport(
            @PathVariable Long id,
            @RequestBody VerifyUtilizationReportRequest req,
            Authentication auth) {
        String officer = auth != null ? auth.getName() : "officer_sharma";
        return ResponseEntity.ok(disbursementService.verifyUtilizationReport(id, req, officer));
    }
}
