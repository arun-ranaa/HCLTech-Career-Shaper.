package com.abes.grants.service;

import com.abes.grants.dto.DTOs.EligibilityCheckResult;
import com.abes.grants.model.Application;
import com.abes.grants.model.GrantProgram;
import com.abes.grants.model.ProgramEligibilityCriterion;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityEngineService {

    public EligibilityCheckResult evaluateApplication(Application app, GrantProgram program) {
        List<String> auditRemarks = new ArrayList<>();
        boolean passedAllMandatory = true;

        // 1. Validate Requested Grant Amount within Program Boundaries
        if (app.getRequestedAmount() != null) {
            if (program.getMinGrantAmount() != null && app.getRequestedAmount().compareTo(program.getMinGrantAmount()) < 0) {
                passedAllMandatory = false;
                auditRemarks.add(String.format("Requested amount (INR %s) is below program minimum of INR %s.",
                        app.getRequestedAmount(), program.getMinGrantAmount()));
            }
            if (program.getMaxGrantAmount() != null && app.getRequestedAmount().compareTo(program.getMaxGrantAmount()) > 0) {
                passedAllMandatory = false;
                auditRemarks.add(String.format("Requested amount (INR %s) exceeds program maximum cap of INR %s.",
                        app.getRequestedAmount(), program.getMaxGrantAmount()));
            }
        }

        // 2. Validate Configured Program Eligibility Rules
        if (program.getCriteria() != null && !program.getCriteria().isEmpty()) {
            for (ProgramEligibilityCriterion crit : program.getCriteria()) {
                boolean criterionPassed = evaluateCriterion(app, crit);
                boolean isMandatory = "Y".equalsIgnoreCase(crit.getIsMandatory());

                if (!criterionPassed) {
                    auditRemarks.add(String.format("Failed rule '%s' (%s). Expected: %s",
                            crit.getCriterionName(), crit.getCriterionCode(), crit.getExpectedValue()));
                    if (isMandatory) {
                        passedAllMandatory = false;
                    }
                }
            }
        }

        if (passedAllMandatory) {
            if (auditRemarks.isEmpty()) {
                auditRemarks.add("All mandatory program criteria and grant ceilings validated successfully.");
            }
            return new EligibilityCheckResult(true, "AUTO_ELIGIBLE", auditRemarks);
        } else {
            return new EligibilityCheckResult(false, "AUTO_INELIGIBLE", auditRemarks);
        }
    }

    private boolean evaluateCriterion(Application app, ProgramEligibilityCriterion crit) {
        String code = crit.getCriterionCode() != null ? crit.getCriterionCode().toUpperCase() : "";
        String type = crit.getCriterionType() != null ? crit.getCriterionType().toUpperCase() : "";
        String expected = crit.getExpectedValue() != null ? crit.getExpectedValue().trim() : "";

        try {
            switch (code) {
                case "MIN_OPERATING_YEARS":
                    int reqYears = Integer.parseInt(expected);
                    return app.getYearsInOperation() != null && app.getYearsInOperation() >= reqYears;

                case "MAX_AGE_YEARS":
                    int maxYears = Integer.parseInt(expected);
                    return app.getYearsInOperation() != null && app.getYearsInOperation() <= maxYears;

                case "MIN_TURNOVER_LAKHS":
                    BigDecimal reqMinTurnover = new BigDecimal(expected).multiply(new BigDecimal("100000"));
                    return app.getAnnualTurnover() != null && app.getAnnualTurnover().compareTo(reqMinTurnover) >= 0;

                case "MAX_TURNOVER_CRORES":
                    BigDecimal reqMaxTurnover = new BigDecimal(expected).multiply(new BigDecimal("10000000"));
                    return app.getAnnualTurnover() != null && app.getAnnualTurnover().compareTo(reqMaxTurnover) <= 0;

                case "ENTITY_TYPE_ALLOWED":
                    List<String> allowedTypes = Arrays.stream(expected.split(","))
                            .map(String::trim)
                            .map(String::toUpperCase)
                            .toList();
                    return app.getOrganizationType() != null &&
                            allowedTypes.contains(app.getOrganizationType().trim().toUpperCase());

                case "GST_REGISTRATION":
                    if ("TRUE".equalsIgnoreCase(expected)) {
                        return app.getOrganizationGstin() != null && !app.getOrganizationGstin().trim().isEmpty();
                    }
                    return true;

                case "PAN_VALIDATION":
                    return app.getOrganizationPan() != null && app.getOrganizationPan().trim().length() == 10;

                default:
                    // Generic type evaluation fallback
                    if ("NUMERIC_MIN".equals(type)) {
                        return app.getYearsInOperation() != null && app.getYearsInOperation() >= Integer.parseInt(expected);
                    } else if ("BOOLEAN".equals(type)) {
                        return true;
                    }
                    return true;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
