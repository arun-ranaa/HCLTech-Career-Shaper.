package com.abes.grants.repository;

import com.abes.grants.model.ApplicationReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationReviewRepository extends JpaRepository<ApplicationReview, Long> {
    List<ApplicationReview> findByApplication_ApplicationId(Long applicationId);
    List<ApplicationReview> findByReviewer_UserId(Long reviewerId);
}
