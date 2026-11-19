package com.abes.grants.repository;

import com.abes.grants.model.UtilizationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilizationReportRepository extends JpaRepository<UtilizationReport, Long> {
    List<UtilizationReport> findByApplication_ApplicationId(Long applicationId);
    List<UtilizationReport> findByVerificationStatus(String verificationStatus);
}
