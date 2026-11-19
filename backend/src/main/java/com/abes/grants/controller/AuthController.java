package com.abes.grants.controller;

import com.abes.grants.dto.DTOs.AuthResponse;
import com.abes.grants.dto.DTOs.LoginRequest;
import com.abes.grants.model.User;
import com.abes.grants.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorMessage(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.abes.grants.dto.DTOs.RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(new ErrorMessage("Not authenticated"));
        }
        return authService.findByUsername(authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public static class ErrorMessage {
        private String message;
        public ErrorMessage(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
