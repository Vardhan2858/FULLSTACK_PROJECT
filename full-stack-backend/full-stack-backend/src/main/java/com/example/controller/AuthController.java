package com.example.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.AuthResponse;
import com.example.model.User;
import com.example.repository.UserRepository;
import com.example.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository repo;
    private final JwtService jwtService;

    public AuthController(UserRepository repo, JwtService jwtService) {
        this.repo = repo;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existing = repo.findByEmail(user.getEmail());

        if (existing != null) {
            boolean passwordMatches = existing.getPassword() != null
                && existing.getPassword().equals(user.getPassword());

            if (passwordMatches) {
                String token = jwtService.generateToken(existing.getEmail(), existing.getRole(), existing.getId());
                return ResponseEntity.ok(new AuthResponse(
                    existing.getId(),
                    existing.getName(),
                    existing.getEmail(),
                    existing.getRole(),
                    token
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null || user.getName() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email, and password are required"));
        }

        User existing = repo.findByEmail(user.getEmail());
        if (existing != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered"));
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("BUYER");
        } else {
            user.setRole(user.getRole().toUpperCase());
        }

        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Admin registration is not allowed"));
        }

        if (!"BUYER".equals(user.getRole()) && !"FARMER".equals(user.getRole())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Role must be BUYER or FARMER"));
        }

        user.setPassword(user.getPassword());

        User saved = repo.save(user);
        String token = jwtService.generateToken(saved.getEmail(), saved.getRole(), saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
            saved.getId(),
            saved.getName(),
            saved.getEmail(),
            saved.getRole(),
            token
        ));
    }
}