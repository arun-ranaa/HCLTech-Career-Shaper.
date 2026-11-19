package com.abes.grants.repository;

import com.abes.grants.model.GrantDisbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrantDisbursementRepository extends JpaRepository<GrantDisbursement, Long> {
    List<GrantDisbursement> findByApplication_ApplicationId(Long applicationId);
    Optional<GrantDisbursement> findByDisbursementReference(String disbursementReference);
    List<GrantDisbursement> findByStatus(String status);
}
