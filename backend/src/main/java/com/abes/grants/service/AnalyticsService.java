package com.abes.grants.service;

import com.abes.grants.dto.DTOs.DashboardStatsDTO;
import com.abes.grants.repository.ApplicationRepository;
import com.abes.grants.repository.GrantProgramRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AnalyticsService {

    private final GrantProgramRepository programRepository;
    private final ApplicationRepository applicationRepository;

    public AnalyticsService(GrantProgramRepository programRepository, ApplicationRepository applicationRepository) {
        this.programRepository = programRepository;
        this.applicationRepository = applicationRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();

        long totalProgs = programRepository.count();
        long activeProgs = programRepository.findByStatus("ACTIVE").size();
        BigDecimal totalBudget = programRepository.sumTotalBudget();
        BigDecimal totalDisbursed = programRepository.sumDisbursedBudget();

        long totalApps = applicationRepository.count();
        long approvedApps = applicationRepository.countByStatus("APPROVED");
        long underReviewApps = applicationRepository.countByStatus("UNDER_REVIEW");
        long disbursedApps = applicationRepository.countByStatus("DISBURSED");
        long rejectedApps = applicationRepository.countByStatus("REJECTED");

        dto.setTotalPrograms(totalProgs);
        dto.setActivePrograms(activeProgs);
        dto.setTotalAllocatedBudget(totalBudget != null ? totalBudget : BigDecimal.ZERO);
        dto.setTotalDisbursedBudget(totalDisbursed != null ? totalDisbursed : BigDecimal.ZERO);
        dto.setTotalApplications(totalApps);
        dto.setApplicationsApproved(approvedApps);
        dto.setApplicationsUnderReview(underReviewApps);
        dto.setApplicationsDisbursed(disbursedApps);
        dto.setApplicationsRejected(rejectedApps);

        if (totalBudget != null && totalBudget.compareTo(BigDecimal.ZERO) > 0 && totalDisbursed != null) {
            double rate = totalDisbursed.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(100)).doubleValue();
            dto.setBudgetUtilizationRate(rate);
        } else {
            dto.setBudgetUtilizationRate(0.0);
        }

        return dto;
    }
}
