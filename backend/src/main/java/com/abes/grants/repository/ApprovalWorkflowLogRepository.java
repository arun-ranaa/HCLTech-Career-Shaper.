package com.abes.grants.repository;

import com.abes.grants.model.ApprovalWorkflowLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalWorkflowLogRepository extends JpaRepository<ApprovalWorkflowLog, Long> {
    List<ApprovalWorkflowLog> findByApplication_ApplicationIdOrderByActionTimestampDesc(Long applicationId);
}
