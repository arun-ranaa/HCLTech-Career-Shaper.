package com.abes.grants.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "APPLICATION_REVIEWS")
public class ApplicationReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonBackReference
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Column(name = "feasibility_score", nullable = false)
    private Integer feasibilityScore = 0; // 0 - 25

    @Column(name = "innovation_score", nullable = false)
    private Integer innovationScore = 0; // 0 - 25

    @Column(name = "budget_realism_score", nullable = false)
    private Integer budgetRealismScore = 0; // 0 - 25

    @Column(name = "social_impact_score", nullable = false)
    private Integer socialImpactScore = 0; // 0 - 25

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0; // 0 - 100

    @Column(name = "recommendation", nullable = false, length = 30)
    private String recommendation = "PENDING"; // RECOMMEND_APPROVE, RECOMMEND_REJECT, NEEDS_REVISION, PENDING

    @Column(name = "review_comments", length = 4000)
    private String reviewComments;

    @Column(name = "review_date", nullable = false)
    private LocalDateTime reviewDate = LocalDateTime.now();

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ASSIGNED"; // ASSIGNED, IN_PROGRESS, SUBMITTED

    public ApplicationReview() {}

    public void recalculateTotal() {
        this.totalScore = (feasibilityScore != null ? feasibilityScore : 0) +
                          (innovationScore != null ? innovationScore : 0) +
                          (budgetRealismScore != null ? budgetRealismScore : 0) +
                          (socialImpactScore != null ? socialImpactScore : 0);
    }

    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public Integer getFeasibilityScore() { return feasibilityScore; }
    public void setFeasibilityScore(Integer feasibilityScore) {
        this.feasibilityScore = feasibilityScore;
        recalculateTotal();
    }

    public Integer getInnovationScore() { return innovationScore; }
    public void setInnovationScore(Integer innovationScore) {
        this.innovationScore = innovationScore;
        recalculateTotal();
    }

    public Integer getBudgetRealismScore() { return budgetRealismScore; }
    public void setBudgetRealismScore(Integer budgetRealismScore) {
        this.budgetRealismScore = budgetRealismScore;
        recalculateTotal();
    }

    public Integer getSocialImpactScore() { return socialImpactScore; }
    public void setSocialImpactScore(Integer socialImpactScore) {
        this.socialImpactScore = socialImpactScore;
        recalculateTotal();
    }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getReviewComments() { return reviewComments; }
    public void setReviewComments(String reviewComments) { this.reviewComments = reviewComments; }

    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
