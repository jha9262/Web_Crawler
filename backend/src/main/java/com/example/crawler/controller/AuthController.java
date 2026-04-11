package com.example.crawler.controller;

import com.example.crawler.config.RateLimiterService;
import com.example.crawler.model.AuthRequest;
import com.example.crawler.model.AuthResponse;
import com.example.crawler.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final RateLimiterService rateLimiterService;

    public AuthController(AuthService authService, RateLimiterService rateLimiterService) {
        this.authService = authService;
        this.rateLimiterService = rateLimiterService;
    }

    /**
     * POST /api/auth/signup
     * Returns 201 Created on success, 409 Conflict on duplicate user, 429 on rate limit.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody AuthRequest request,
                                    HttpServletRequest httpRequest) {
        if (!rateLimiterService.tryConsume(httpRequest)) {
            log.warn("Rate limit exceeded for signup from IP: {}", httpRequest.getRemoteAddr());
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Too many requests. Please try again later.", "success", false));
        }

        AuthResponse response = authService.signup(request);

        if (!response.isSuccess()) {
            // Duplicate user → 409 Conflict
            if (response.getMessage() != null &&
                    (response.getMessage().contains("already exists") || response.getMessage().contains("already registered"))) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Returns 200 OK on success, 401 Unauthorized on bad credentials, 429 on rate limit.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request,
                                   HttpServletRequest httpRequest) {
        if (!rateLimiterService.tryConsume(httpRequest)) {
            log.warn("Rate limit exceeded for login from IP: {}", httpRequest.getRemoteAddr());
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Too many requests. Please try again later.", "success", false));
        }

        AuthResponse response = authService.login(request);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/refresh
     * Body: { "refreshToken": "..." }
     * Returns 200 with new token pair, or 401 on invalid/expired refresh token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        AuthResponse response = authService.refreshToken(refreshToken);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return ResponseEntity.ok(response);
    }
}