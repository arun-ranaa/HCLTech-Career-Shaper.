package com.abes.grants.repository;

import com.abes.grants.model.GrantProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrantProgramRepository extends JpaRepository<GrantProgram, Long> {
    Optional<GrantProgram> findByProgramCode(String programCode);
    List<GrantProgram> findByStatus(String status);
    List<GrantProgram> findByCategory(String category);

    @Query("SELECT COALESCE(SUM(p.totalBudget), 0) FROM GrantProgram p")
    BigDecimal sumTotalBudget();

    @Query("SELECT COALESCE(SUM(p.disbursedBudget), 0) FROM GrantProgram p")
    BigDecimal sumDisbursedBudget();
}
