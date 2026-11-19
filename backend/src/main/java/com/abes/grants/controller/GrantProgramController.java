package com.abes.grants.controller;

import com.abes.grants.dto.DTOs.ProgramDTO;
import com.abes.grants.service.GrantProgramService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/programs")
@CrossOrigin(origins = "*")
public class GrantProgramController {

    private final GrantProgramService programService;

    public GrantProgramController(GrantProgramService programService) {
        this.programService = programService;
    }

    @GetMapping
    public ResponseEntity<List<ProgramDTO>> getAllPrograms(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(programService.getAllPrograms(status, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgramDTO> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(programService.getProgramById(id));
    }

    @PostMapping
    public ResponseEntity<ProgramDTO> createProgram(@RequestBody ProgramDTO dto, Authentication auth) {
        String username = auth != null ? auth.getName() : "officer_sharma";
        ProgramDTO created = programService.createProgram(dto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProgramDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(programService.updateStatus(id, status));
    }
}
