package com.abes.grants.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "PROGRAM_ELIGIBILITY_CRITERIA")
public class ProgramEligibilityCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "criterion_id")
    private Long criterionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    @JsonBackReference
    private GrantProgram program;

    @Column(name = "criterion_code", nullable = false, length = 50)
    private String criterionCode;

    @Column(name = "criterion_name", nullable = false, length = 200)
    private String criterionName;

    @Column(name = "criterion_type", nullable = false, length = 30)
    private String criterionType; // NUMERIC_MIN, NUMERIC_MAX, TEXT_EQUAL, BOOLEAN, IN_LIST

    @Column(name = "expected_value", nullable = false, length = 255)
    private String expectedValue;

    @Column(name = "is_mandatory", nullable = false, length = 1)
    private String isMandatory = "Y";

    @Column(name = "weightage", nullable = false)
    private Integer weightage = 10;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProgramEligibilityCriterion() {}

    public Long getCriterionId() { return criterionId; }
    public void setCriterionId(Long criterionId) { this.criterionId = criterionId; }

    public GrantProgram getProgram() { return program; }
    public void setProgram(GrantProgram program) { this.program = program; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
