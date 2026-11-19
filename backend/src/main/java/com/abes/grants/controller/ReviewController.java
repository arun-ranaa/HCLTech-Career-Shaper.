package com.abes.grants.controller;

import com.abes.grants.dto.DTOs.SubmitReviewRequest;
import com.abes.grants.model.ApplicationReview;
import com.abes.grants.service.ReviewWorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewWorkflowService reviewWorkflowService;

    public ReviewController(ReviewWorkflowService reviewWorkflowService) {
        this.reviewWorkflowService = reviewWorkflowService;
    }

    @PostMapping("/{reviewId}/submit")
    public ResponseEntity<ApplicationReview> submitReview(
            @PathVariable Long reviewId,
            @RequestBody SubmitReviewRequest request,
            Authentication auth) {
        String reviewer = auth != null ? auth.getName() : "reviewer_kapoor";
        return ResponseEntity.ok(reviewWorkflowService.submitReview(reviewId, request, reviewer));
    }
}
