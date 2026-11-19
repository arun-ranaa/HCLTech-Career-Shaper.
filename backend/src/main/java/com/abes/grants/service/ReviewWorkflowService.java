package com.abes.grants.service;

import com.abes.grants.dto.DTOs.DecisionRequest;
import com.abes.grants.dto.DTOs.SubmitReviewRequest;
import com.abes.grants.model.Application;
import com.abes.grants.model.ApplicationReview;
import com.abes.grants.model.ApprovalWorkflowLog;
import com.abes.grants.model.User;
import com.abes.grants.repository.ApplicationRepository;
import com.abes.grants.repository.ApplicationReviewRepository;
import com.abes.grants.repository.ApprovalWorkflowLogRepository;
import com.abes.grants.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewWorkflowService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationReviewRepository reviewRepository;
    private final ApprovalWorkflowLogRepository workflowLogRepository;
    private final UserRepository userRepository;

    public ReviewWorkflowService(ApplicationRepository applicationRepository,
                                 ApplicationReviewRepository reviewRepository,
                                 ApprovalWorkflowLogRepository workflowLogRepository,
                                 UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.reviewRepository = reviewRepository;
        this.workflowLogRepository = workflowLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ApplicationReview assignReviewer(Long applicationId, Long reviewerId, String officerUsername) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found: " + reviewerId));
        User officer = userRepository.findByUsername(officerUsername)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));

        ApplicationReview review = new ApplicationReview();
        review.setApplication(app);
        review.setReviewer(reviewer);
        review.setStatus("ASSIGNED");
        review.setReviewDate(LocalDateTime.now());
        ApplicationReview saved = reviewRepository.save(review);

        String prevStatus = app.getStatus();
        app.setStatus("UNDER_REVIEW");
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);

        ApprovalWorkflowLog log = new ApprovalWorkflowLog(
                app, officer, prevStatus, "UNDER_REVIEW", "ASSIGN_REVIEWER",
                "Assigned technical evaluation to " + reviewer.getFullName() + " (" + reviewer.getDesignation() + ")."
        );
        workflowLogRepository.save(log);

        return saved;
    }

    @Transactional
    public ApplicationReview submitReview(Long reviewId, SubmitReviewRequest req, String reviewerUsername) {
        ApplicationReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found: " + reviewId));

        review.setFeasibilityScore(req.getFeasibilityScore());
        review.setInnovationScore(req.getInnovationScore());
        review.setBudgetRealismScore(req.getBudgetRealismScore());
        review.setSocialImpactScore(req.getSocialImpactScore());
        review.setRecommendation(req.getRecommendation());
        review.setReviewComments(req.getReviewComments());
        review.setStatus("SUBMITTED");
        review.setReviewDate(LocalDateTime.now());
        review.recalculateTotal();

        ApplicationReview saved = reviewRepository.save(review);

        ApprovalWorkflowLog log = new ApprovalWorkflowLog(
                review.getApplication(), review.getReviewer(), "UNDER_REVIEW", "UNDER_REVIEW", "SUBMIT_REVIEW",
                String.format("Technical Score: %d/100 | Recommendation: %s | Remarks: %s",
                        saved.getTotalScore(), saved.getRecommendation(), saved.getReviewComments())
        );
        workflowLogRepository.save(log);

        return saved;
    }

    @Transactional
    public Application decideApplication(Long applicationId, DecisionRequest req, String officerUsername) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));
        User officer = userRepository.findByUsername(officerUsername)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));

        String prevStatus = app.getStatus();
        String newStatus = "APPROVE".equalsIgnoreCase(req.getDecision()) ? "APPROVED" : "REJECTED";

        app.setStatus(newStatus);
        if ("APPROVED".equals(newStatus)) {
            app.setApprovedAmount(req.getApprovedAmount() != null ? req.getApprovedAmount() : app.getRequestedAmount());
        }
        app.setUpdatedAt(LocalDateTime.now());
        Application saved = applicationRepository.save(app);

        ApprovalWorkflowLog log = new ApprovalWorkflowLog(
                app, officer, prevStatus, newStatus,
                "APPROVE".equalsIgnoreCase(req.getDecision()) ? "APPROVE" : "REJECT",
                req.getDecisionNotes() + ("APPROVED".equals(newStatus) ? " [Approved Amount: INR " + app.getApprovedAmount() + "]" : "")
        );
        workflowLogRepository.save(log);

        return saved;
    }

    public List<ApplicationReview> getReviewsForApplication(Long applicationId) {
        return reviewRepository.findByApplication_ApplicationId(applicationId);
    }

    public List<ApprovalWorkflowLog> getWorkflowLogs(Long applicationId) {
        return workflowLogRepository.findByApplication_ApplicationIdOrderByActionTimestampDesc(applicationId);
    }
}
