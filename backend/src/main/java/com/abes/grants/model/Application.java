package com.abes.grants.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "APPLICATIONS")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "application_number", unique = true, nullable = false, length = 50)
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "program_id", nullable = false)
    private GrantProgram program;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(name = "project_title", nullable = false, length = 255)
    private String projectTitle;

    @Column(name = "project_summary", nullable = false, length = 4000)
    private String projectSummary;

    @Column(name = "requested_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal requestedAmount;

    @Column(name = "approved_amount", precision = 14, scale = 2)
    private BigDecimal approvedAmount;

    @Column(name = "project_duration_months", nullable = false)
    private Integer projectDurationMonths;

    @Column(name = "target_beneficiaries", length = 255)
    private String targetBeneficiaries;

    @Column(name = "state_or_region", nullable = false, length = 100)
    private String stateOrRegion;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "organization_type", nullable = false, length = 100)
    private String organizationType;

    @Column(name = "organization_pan", nullable = false, length = 20)
    private String organizationPan;

    @Column(name = "organization_gstin", length = 20)
    private String organizationGstin;

    @Column(name = "annual_turnover", nullable = false, precision = 14, scale = 2)
    private BigDecimal annualTurnover = BigDecimal.ZERO;

    @Column(name = "years_in_operation", nullable = false)
    private Integer yearsInOperation = 0;

    @Column(name = "eligibility_status", nullable = false, length = 30)
    private String eligibilityStatus = "CHECK_PENDING"; // CHECK_PENDING, AUTO_ELIGIBLE, AUTO_INELIGIBLE, OVERRIDDEN_ELIGIBLE

    @Column(name = "eligibility_remarks", length = 1000)
    private String eligibilityRemarks;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate = LocalDateTime.now();

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SUBMITTED"; // DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED, COMPLETED

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ApplicationDocument> documents = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ApplicationReview> reviews = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Application() {}

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public GrantProgram getProgram() { return program; }
    public void setProgram(GrantProgram program) { this.program = program; }

    public User getApplicant() { return applicant; }
    public void setApplicant(User applicant) { this.applicant = applicant; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getProjectSummary() { return projectSummary; }
    public void setProjectSummary(String projectSummary) { this.projectSummary = projectSummary; }

    public BigDecimal getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }

    public BigDecimal getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(BigDecimal approvedAmount) { this.approvedAmount = approvedAmount; }

    public Integer getProjectDurationMonths() { return projectDurationMonths; }
    public void setProjectDurationMonths(Integer projectDurationMonths) { this.projectDurationMonths = projectDurationMonths; }

    public String getTargetBeneficiaries() { return targetBeneficiaries; }
    public void setTargetBeneficiaries(String targetBeneficiaries) { this.targetBeneficiaries = targetBeneficiaries; }

    public String getStateOrRegion() { return stateOrRegion; }
    public void setStateOrRegion(String stateOrRegion) { this.stateOrRegion = stateOrRegion; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getOrganizationType() { return organizationType; }
    public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }

    public String getOrganizationPan() { return organizationPan; }
    public void setOrganizationPan(String organizationPan) { this.organizationPan = organizationPan; }

    public String getOrganizationGstin() { return organizationGstin; }
    public void setOrganizationGstin(String organizationGstin) { this.organizationGstin = organizationGstin; }

    public BigDecimal getAnnualTurnover() { return annualTurnover; }
    public void setAnnualTurnover(BigDecimal annualTurnover) { this.annualTurnover = annualTurnover; }

    public Integer getYearsInOperation() { return yearsInOperation; }
    public void setYearsInOperation(Integer yearsInOperation) { this.yearsInOperation = yearsInOperation; }

    public String getEligibilityStatus() { return eligibilityStatus; }
    public void setEligibilityStatus(String eligibilityStatus) { this.eligibilityStatus = eligibilityStatus; }

    public String getEligibilityRemarks() { return eligibilityRemarks; }
    public void setEligibilityRemarks(String eligibilityRemarks) { this.eligibilityRemarks = eligibilityRemarks; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<ApplicationDocument> getDocuments() { return documents; }
    public void setDocuments(List<ApplicationDocument> documents) { this.documents = documents; }

    public List<ApplicationReview> getReviews() { return reviews; }
    public void setReviews(List<ApplicationReview> reviews) { this.reviews = reviews; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
