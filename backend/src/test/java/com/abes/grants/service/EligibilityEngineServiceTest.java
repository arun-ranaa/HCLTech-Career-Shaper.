package com.abes.grants.service;

import com.abes.grants.dto.DTOs.EligibilityCheckResult;
import com.abes.grants.model.Application;
import com.abes.grants.model.GrantProgram;
import com.abes.grants.model.ProgramEligibilityCriterion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EligibilityEngineServiceTest {

    private EligibilityEngineService engine;
    private GrantProgram program;

    @BeforeEach
    void setUp() {
        engine = new EligibilityEngineService();
        program = new GrantProgram();
        program.setProgramId(1L);
        program.setProgramCode("TEST-PROG-01");
        program.setMinGrantAmount(new BigDecimal("1000000.00")); // 10 Lakhs
        program.setMaxGrantAmount(new BigDecimal("7500000.00")); // 75 Lakhs

        List<ProgramEligibilityCriterion> criteria = new ArrayList<>();

        ProgramEligibilityCriterion c1 = new ProgramEligibilityCriterion();
        c1.setCriterionCode("MIN_OPERATING_YEARS");
        c1.setCriterionName("Minimum Years in Operation");
        c1.setCriterionType("NUMERIC_MIN");
        c1.setExpectedValue("2");
        c1.setIsMandatory("Y");
        criteria.add(c1);

        ProgramEligibilityCriterion c2 = new ProgramEligibilityCriterion();
        c2.setCriterionCode("ENTITY_TYPE_ALLOWED");
        c2.setCriterionName("Permissible Entity Type");
        c2.setCriterionType("IN_LIST");
        c2.setExpectedValue("Startup,MSME,LLP");
        c2.setIsMandatory("Y");
        criteria.add(c2);

        ProgramEligibilityCriterion c3 = new ProgramEligibilityCriterion();
        c3.setCriterionCode("GST_REGISTRATION");
        c3.setCriterionName("Valid GST");
        c3.setCriterionType("BOOLEAN");
        c3.setExpectedValue("TRUE");
        c3.setIsMandatory("Y");
        criteria.add(c3);

        program.setCriteria(criteria);
    }

    @Test
    @DisplayName("TC-MOD2-01: Valid Application passes all mandatory criteria")
    void testValidApplicationPasses() {
        Application app = new Application();
        app.setRequestedAmount(new BigDecimal("4500000.00")); // 45 Lakhs (within 10L - 75L)
        app.setYearsInOperation(3); // >= 2
        app.setOrganizationType("Startup");
        app.setOrganizationGstin("24AAACK1234F1Z8");

        EligibilityCheckResult result = engine.evaluateApplication(app, program);
        assertTrue(result.isEligible());
        assertEquals("AUTO_ELIGIBLE", result.getStatus());
    }

    @Test
    @DisplayName("TC-MOD2-02: Fails when years in operation is below threshold")
    void testFailsOperatingYears() {
        Application app = new Application();
        app.setRequestedAmount(new BigDecimal("4500000.00"));
        app.setYearsInOperation(1); // 1 < 2 -> Fail
        app.setOrganizationType("Startup");
        app.setOrganizationGstin("24AAACK1234F1Z8");

        EligibilityCheckResult result = engine.evaluateApplication(app, program);
        assertFalse(result.isEligible());
        assertEquals("AUTO_INELIGIBLE", result.getStatus());
        assertTrue(result.getDetails().stream().anyMatch(d -> d.contains("MIN_OPERATING_YEARS")));
    }

    @Test
    @DisplayName("TC-MOD2-03: Fails when requested amount exceeds program maximum")
    void testFailsRequestedAmountExceedsMax() {
        Application app = new Application();
        app.setRequestedAmount(new BigDecimal("9000000.00")); // 90 Lakhs > 75 Lakhs cap -> Fail
        app.setYearsInOperation(4);
        app.setOrganizationType("MSME");
        app.setOrganizationGstin("24AAACK1234F1Z8");

        EligibilityCheckResult result = engine.evaluateApplication(app, program);
        assertFalse(result.isEligible());
        assertEquals("AUTO_INELIGIBLE", result.getStatus());
        assertTrue(result.getDetails().stream().anyMatch(d -> d.contains("exceeds program maximum cap")));
    }

    @Test
    @DisplayName("TC-MOD2-04: Passes at exact boundary of minimum grant amount")
    void testPassesAtExactBoundary() {
        Application app = new Application();
        app.setRequestedAmount(new BigDecimal("1000000.00")); // Exactly equal to min 10 Lakhs
        app.setYearsInOperation(2); // Exactly equal to min 2 years
        app.setOrganizationType("LLP");
        app.setOrganizationGstin("24AAACK1234F1Z8");

        EligibilityCheckResult result = engine.evaluateApplication(app, program);
        assertTrue(result.isEligible());
        assertEquals("AUTO_ELIGIBLE", result.getStatus());
    }
}
