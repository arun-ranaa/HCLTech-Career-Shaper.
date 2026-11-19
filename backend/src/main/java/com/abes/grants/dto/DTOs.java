package com.abes.grants.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DTOs {

    // --- Authentication ---
    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private Long userId;
        private String username;
        private String fullName;
        private String email;
        private String role;
        private String organizationName;

        public AuthResponse(String token, Long userId, String username, String fullName, String email, String role, String organizationName) {
            this.token = token;
            this.userId = userId;
            this.username = username;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.organizationName = organizationName;
        }

        public String getToken() { return token; }
        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getOrganizationName() { return organizationName; }
    }

    // --- Module 1: Program DTOs ---
    public static class CriterionDTO {
        private Long criterionId;
        private String criterionCode;
        private String criterionName;
        private String criterionType;
        private String expectedValue;
        private String isMandatory;
        private Integer weightage;

        public Long getCriterionId() { return criterionId; }
        public void setCriterionId(Long criterionId) { this.criterionId = criterionId; }
        public String getCriterionCode() { return criterionCode; }
        public void setCriterionCode(String criterionCode) { this.criterionCode = criterionCode; }
        public String getCriterionName() { return criterionName; }
        public void setCriterionName(String criterionName) { this.criterionName = criterionName; }
        public String getCriterionType() { return criterionType; }
        public void setCriterionType(String criterionType) { this.criterionType = criterionType; }
        public String getExpectedValue() { return expectedValue; }
        public void setExpectedValue(String expectedValue) { this.expectedValue = expectedValue; }
        public String getIsMandatory() { return isMandatory; }
        public void setIsMandatory(String isMandatory) { this.isMandatory = isMandatory; }
        public Integer getWeightage() { return weightage; }
        public void setWeightage(Integer weightage) { this.weightage = weightage; }
    }

    public static class ProgramDTO {
        private Long programId;
        private String programCode;
        private String title;
        private String category;
        private String fundingAgency;
        private String description;
        private BigDecimal totalBudget;
        private BigDecimal disbursedBudget;
        private BigDecimal minGrantAmount;
        private BigDecimal maxGrantAmount;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String eligibilitySummary;
        private List<CriterionDTO> criteria;

        public Long getProgramId() { return programId; }
        public void setProgramId(Long programId) { this.programId = programId; }
        public String getProgramCode() { return programCode; }
        public void setProgramCode(String programCode) { this.programCode = programCode; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getFundingAgency() { return fundingAgency; }
        public void setFundingAgency(String fundingAgency) { this.fundingAgency = fundingAgency; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public BigDecimal getTotalBudget() { return totalBudget; }
        public void setTotalBudget(BigDecimal totalBudget) { this.totalBudget = totalBudget; }
        public BigDecimal getDisbursedBudget() { return disbursedBudget; }
        public void setDisbursedBudget(BigDecimal disbursedBudget) { this.disbursedBudget = disbursedBudget; }
        public BigDecimal getMinGrantAmount() { return minGrantAmount; }
        public void setMinGrantAmount(BigDecimal minGrantAmount) { this.minGrantAmount = minGrantAmount; }
        public BigDecimal getMaxGrantAmount() { return maxGrantAmount; }
        public void setMaxGrantAmount(BigDecimal maxGrantAmount) { this.maxGrantAmount = maxGrantAmount; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getEligibilitySummary() { return eligibilitySummary; }
        public void setEligibilitySummary(String eligibilitySummary) { this.eligibilitySummary = eligibilitySummary; }
        public List<CriterionDTO> getCriteria() { return criteria; }
        public void setCriteria(List<CriterionDTO> criteria) { this.criteria = criteria; }
    }

    // --- Module 2: Application DTOs ---
    public static class ApplicationSubmitRequest {
        private Long programId;
        private String projectTitle;
        private String projectSummary;
        private BigDecimal requestedAmount;
        private Integer projectDurationMonths;
        private String targetBeneficiaries;
        private String stateOrRegion;
        private String district;
        private String organizationType;
        private String organizationPan;
        private String organizationGstin;
        private BigDecimal annualTurnover;
        private Integer yearsInOperation;

        public Long getProgramId() { return programId; }
        public void setProgramId(Long programId) { this.programId = programId; }
        public String getProjectTitle() { return projectTitle; }
        public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }
        public String getProjectSummary() { return projectSummary; }
        public void setProjectSummary(String projectSummary) { this.projectSummary = projectSummary; }
        public BigDecimal getRequestedAmount() { return requestedAmount; }
        public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }
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
    }

    public static class EligibilityCheckResult {
        private boolean eligible;
        private String status;
        private List<String> details;

        public EligibilityCheckResult(boolean eligible, String status, List<String> details) {
            this.eligible = eligible;
            this.status = status;
            this.details = details;
        }

        public boolean isEligible() { return eligible; }
        public String getStatus() { return status; }
        public List<String> getDetails() { return details; }
    }

    // --- Module 3: Review DTOs ---
    public static class AssignReviewerRequest {
        private Long reviewerId;
        public Long getReviewerId() { return reviewerId; }
        public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }
    }

    public static class SubmitReviewRequest {
        private Integer feasibilityScore;
        private Integer innovationScore;
        private Integer budgetRealismScore;
        private Integer socialImpactScore;
        private String recommendation;
        private String reviewComments;

        public Integer getFeasibilityScore() { return feasibilityScore; }
        public void setFeasibilityScore(Integer feasibilityScore) { this.feasibilityScore = feasibilityScore; }
        public Integer getInnovationScore() { return innovationScore; }
        public void setInnovationScore(Integer innovationScore) { this.innovationScore = innovationScore; }
        public Integer getBudgetRealismScore() { return budgetRealismScore; }
        public void setBudgetRealismScore(Integer budgetRealismScore) { this.budgetRealismScore = budgetRealismScore; }
        public Integer getSocialImpactScore() { return socialImpactScore; }
        public void setSocialImpactScore(Integer socialImpactScore) { this.socialImpactScore = socialImpactScore; }
        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
        public String getReviewComments() { return reviewComments; }
        public void setReviewComments(String reviewComments) { this.reviewComments = reviewComments; }
    }

    public static class DecisionRequest {
        private String decision; // APPROVE or REJECT
        private BigDecimal approvedAmount;
        private String decisionNotes;

        public String getDecision() { return decision; }
        public void setDecision(String decision) { this.decision = decision; }
        public BigDecimal getApprovedAmount() { return approvedAmount; }
        public void setApprovedAmount(BigDecimal approvedAmount) { this.approvedAmount = approvedAmount; }
        public String getDecisionNotes() { return decisionNotes; }
        public void setDecisionNotes(String decisionNotes) { this.decisionNotes = decisionNotes; }
    }

    // --- Module 4: Disbursement & Reporting DTOs ---
    public static class ScheduleDisbursementRequest {
        private Integer trancheNumber;
        private BigDecimal disbursementAmount;
        private String paymentMethod;
        private String bankName;
        private String accountNumberMasked;
        private String ifscCode;
        private LocalDate scheduledDate;
        private String remarks;

        public Integer getTrancheNumber() { return trancheNumber; }
        public void setTrancheNumber(Integer trancheNumber) { this.trancheNumber = trancheNumber; }
        public BigDecimal getDisbursementAmount() { return disbursementAmount; }
        public void setDisbursementAmount(BigDecimal disbursementAmount) { this.disbursementAmount = disbursementAmount; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }
        public String getAccountNumberMasked() { return accountNumberMasked; }
        public void setAccountNumberMasked(String accountNumberMasked) { this.accountNumberMasked = accountNumberMasked; }
        public String getIfscCode() { return ifscCode; }
        public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }
        public LocalDate getScheduledDate() { return scheduledDate; }
        public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }

    public static class ExecuteDisbursementRequest {
        private String transactionReference;
        private LocalDate disbursementDate;

        public String getTransactionReference() { return transactionReference; }
        public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }
        public LocalDate getDisbursementDate() { return disbursementDate; }
        public void setDisbursementDate(LocalDate disbursementDate) { this.disbursementDate = disbursementDate; }
    }

    public static class SubmitUtilizationReportRequest {
        private Integer trancheNumber;
        private String milestoneTitle;
        private BigDecimal amountUtilized;
        private BigDecimal utilizationPercentage;
        private String progressNarrative;

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
    }

    public static class VerifyUtilizationReportRequest {
        private String verificationStatus;
        private String verificationRemarks;

        public String getVerificationStatus() { return verificationStatus; }
        public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
        public String getVerificationRemarks() { return verificationRemarks; }
        public void setVerificationRemarks(String verificationRemarks) { this.verificationRemarks = verificationRemarks; }
    }

    public static class DashboardStatsDTO {
        private long totalPrograms;
        private long activePrograms;
        private BigDecimal totalAllocatedBudget;
        private BigDecimal totalDisbursedBudget;
        private long totalApplications;
        private long applicationsApproved;
        private long applicationsUnderReview;
        private long applicationsDisbursed;
        private long applicationsRejected;
        private double budgetUtilizationRate;

        public long getTotalPrograms() { return totalPrograms; }
        public void setTotalPrograms(long totalPrograms) { this.totalPrograms = totalPrograms; }
        public long getActivePrograms() { return activePrograms; }
        public void setActivePrograms(long activePrograms) { this.activePrograms = activePrograms; }
        public BigDecimal getTotalAllocatedBudget() { return totalAllocatedBudget; }
        public void setTotalAllocatedBudget(BigDecimal totalAllocatedBudget) { this.totalAllocatedBudget = totalAllocatedBudget; }
        public BigDecimal getTotalDisbursedBudget() { return totalDisbursedBudget; }
        public void setTotalDisbursedBudget(BigDecimal totalDisbursedBudget) { this.totalDisbursedBudget = totalDisbursedBudget; }
        public long getTotalApplications() { return totalApplications; }
        public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
        public long getApplicationsApproved() { return applicationsApproved; }
        public void setApplicationsApproved(long applicationsApproved) { this.applicationsApproved = applicationsApproved; }
        public long getApplicationsUnderReview() { return applicationsUnderReview; }
        public void setApplicationsUnderReview(long applicationsUnderReview) { this.applicationsUnderReview = applicationsUnderReview; }
        public long getApplicationsDisbursed() { return applicationsDisbursed; }
        public void setApplicationsDisbursed(long applicationsDisbursed) { this.applicationsDisbursed = applicationsDisbursed; }
        public long getApplicationsRejected() { return applicationsRejected; }
        public void setApplicationsRejected(long applicationsRejected) { this.applicationsRejected = applicationsRejected; }
        public double getBudgetUtilizationRate() { return budgetUtilizationRate; }
        public void setBudgetUtilizationRate(double budgetUtilizationRate) { this.budgetUtilizationRate = budgetUtilizationRate; }
    }
}
