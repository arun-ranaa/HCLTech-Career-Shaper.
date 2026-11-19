package com.abes.grants.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "UTILIZATION_REPORTS")
public class UtilizationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "tranche_number", nullable = false)
    private Integer trancheNumber;

    @Column(name = "milestone_title", nullable = false, length = 255)
    private String milestoneTitle;

    @Column(name = "amount_utilized", nullable = false, precision = 14, scale = 2)
    private BigDecimal amountUtilized;

    @Column(name = "utilization_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal utilizationPercentage;

    @Column(name = "progress_narrative", nullable = false, length = 4000)
    private String progressNarrative;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate = LocalDateTime.now();

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus = "PENDING_VERIFICATION"; // PENDING_VERIFICATION, VERIFIED_SATISFACTORY, AUDIT_FLAGGED, REJECTED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "verification_remarks", length = 1000)
    private String verificationRemarks;

    public UtilizationReport() {}

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Integer getTrancheNumber() { return trancheNumber; }
    public void setTrancheNumber(Integer trancheNumber) { this.trancheNumber = trancheNumber; }

    public String getMilestoneTitle() { return milestoneTitle; }
    public void setMilestoneTitle(String milestoneTitle) { this.milestoneTitle = milestoneTitle; }

    public BigDecimal getAmountUtilized() { return amountUtilized; }
    public void setAmountUtilized(BigDecimal amountUtilized) { this.amountUtilized = amountUtilized; }

    public BigDecimal getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(BigDecimal utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }

    public String getProgressNarrative() { return progressNarrative; }
    public void setProgressNarrative(String progressNarrative) { this.progressNarrative = progressNarrative; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public User getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getVerificationRemarks() { return verificationRemarks; }
    public void setVerificationRemarks(String verificationRemarks) { this.verificationRemarks = verificationRemarks; }
}
