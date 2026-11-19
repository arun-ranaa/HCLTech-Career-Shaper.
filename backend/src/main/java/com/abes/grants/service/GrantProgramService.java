package com.abes.grants.service;

import com.abes.grants.dto.DTOs.CriterionDTO;
import com.abes.grants.dto.DTOs.ProgramDTO;
import com.abes.grants.model.GrantProgram;
import com.abes.grants.model.ProgramEligibilityCriterion;
import com.abes.grants.model.User;
import com.abes.grants.repository.GrantProgramRepository;
import com.abes.grants.repository.ProgramEligibilityCriterionRepository;
import com.abes.grants.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GrantProgramService {

    private final GrantProgramRepository programRepository;
    private final ProgramEligibilityCriterionRepository criterionRepository;
    private final UserRepository userRepository;

    public GrantProgramService(GrantProgramRepository programRepository,
                               ProgramEligibilityCriterionRepository criterionRepository,
                               UserRepository userRepository) {
        this.programRepository = programRepository;
        this.criterionRepository = criterionRepository;
        this.userRepository = userRepository;
    }

    public List<ProgramDTO> getAllPrograms(String status, String category) {
        List<GrantProgram> programs;
        if (status != null && !status.isEmpty()) {
            programs = programRepository.findByStatus(status.toUpperCase());
        } else if (category != null && !category.isEmpty()) {
            programs = programRepository.findByCategory(category);
        } else {
            programs = programRepository.findAll();
        }
        return programs.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ProgramDTO getProgramById(Long id) {
        GrantProgram program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grant program not found with ID: " + id));
        return mapToDTO(program);
    }

    @Transactional
    public ProgramDTO createProgram(ProgramDTO dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));

        GrantProgram program = new GrantProgram();
        program.setProgramCode(dto.getProgramCode());
        program.setTitle(dto.getTitle());
        program.setCategory(dto.getCategory());
        program.setFundingAgency(dto.getFundingAgency());
        program.setDescription(dto.getDescription());
        program.setTotalBudget(dto.getTotalBudget());
        program.setDisbursedBudget(BigDecimal.ZERO);
        program.setMinGrantAmount(dto.getMinGrantAmount());
        program.setMaxGrantAmount(dto.getMaxGrantAmount());
        program.setStartDate(dto.getStartDate());
        program.setEndDate(dto.getEndDate());
        program.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        program.setEligibilitySummary(dto.getEligibilitySummary());
        program.setCreatedBy(user);
        program.setCreatedAt(LocalDateTime.now());
        program.setUpdatedAt(LocalDateTime.now());

        if (dto.getCriteria() != null && !dto.getCriteria().isEmpty()) {
            List<ProgramEligibilityCriterion> criteriaList = new ArrayList<>();
            for (CriterionDTO cDto : dto.getCriteria()) {
                ProgramEligibilityCriterion c = new ProgramEligibilityCriterion();
                c.setProgram(program);
                c.setCriterionCode(cDto.getCriterionCode());
                c.setCriterionName(cDto.getCriterionName());
                c.setCriterionType(cDto.getCriterionType());
                c.setExpectedValue(cDto.getExpectedValue());
                c.setIsMandatory(cDto.getIsMandatory() != null ? cDto.getIsMandatory() : "Y");
                c.setWeightage(cDto.getWeightage() != null ? cDto.getWeightage() : 10);
                criteriaList.add(c);
            }
            program.setCriteria(criteriaList);
        }

        GrantProgram saved = programRepository.save(program);
        return mapToDTO(saved);
    }

    @Transactional
    public ProgramDTO updateStatus(Long id, String status) {
        GrantProgram program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grant program not found with ID: " + id));
        program.setStatus(status.toUpperCase());
        program.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(programRepository.save(program));
    }

    public ProgramDTO mapToDTO(GrantProgram p) {
        ProgramDTO dto = new ProgramDTO();
        dto.setProgramId(p.getProgramId());
        dto.setProgramCode(p.getProgramCode());
        dto.setTitle(p.getTitle());
        dto.setCategory(p.getCategory());
        dto.setFundingAgency(p.getFundingAgency());
        dto.setDescription(p.getDescription());
        dto.setTotalBudget(p.getTotalBudget());
        dto.setDisbursedBudget(p.getDisbursedBudget());
        dto.setMinGrantAmount(p.getMinGrantAmount());
        dto.setMaxGrantAmount(p.getMaxGrantAmount());
        dto.setStartDate(p.getStartDate());
        dto.setEndDate(p.getEndDate());
        dto.setStatus(p.getStatus());
        dto.setEligibilitySummary(p.getEligibilitySummary());

        if (p.getCriteria() != null) {
            dto.setCriteria(p.getCriteria().stream().map(c -> {
                CriterionDTO cd = new CriterionDTO();
                cd.setCriterionId(c.getCriterionId());
                cd.setCriterionCode(c.getCriterionCode());
                cd.setCriterionName(c.getCriterionName());
                cd.setCriterionType(c.getCriterionType());
                cd.setExpectedValue(c.getExpectedValue());
                cd.setIsMandatory(c.getIsMandatory());
                cd.setWeightage(c.getWeightage());
                return cd;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
