package com.abes.grants.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "GRANT_PROGRAMS")
public class GrantProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long programId;

    @Column(name = "program_code", unique = true, nullable = false, length = 40)
    private String programCode;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "funding_agency", nullable = false, length = 200)
    private String fundingAgency;

    @Column(name = "description", length = 4000)
    private String description;

    @Column(name = "total_budget", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalBudget;

    @Column(name = "disbursed_budget", nullable = false, precision = 15, scale = 2)
    private BigDecimal disbursedBudget = BigDecimal.ZERO;

    @Column(name = "min_grant_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal minGrantAmount;

    @Column(name = "max_grant_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal maxGrantAmount;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE"; // DRAFT, ACTIVE, UNDER_EVALUATION, CLOSED

    @Column(name = "eligibility_summary", length = 2000)
    private String eligibilitySummary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProgramEligibilityCriterion> criteria = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public GrantProgram() {}

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

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public List<ProgramEligibilityCriterion> getCriteria() { return criteria; }
    public void setCriteria(List<ProgramEligibilityCriterion> criteria) { this.criteria = criteria; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
