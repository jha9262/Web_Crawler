package com.example.crawler.service;

import com.example.crawler.entity.User;
import com.example.crawler.model.AuthRequest;
import com.example.crawler.model.AuthResponse;
import com.example.crawler.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    // Password must have 8+ chars, at least one uppercase, one digit, one special char
    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.expiration-ms:86400000}")
    private long expirationMs;

    @Value("${jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -------------------------------------------------------------------------
    // Signup
    // -------------------------------------------------------------------------
    public AuthResponse signup(AuthRequest request) {
        if (request == null) {
            return error("Invalid request");
        }

        String username = StringUtils.hasText(request.getUsername()) ? request.getUsername().trim() : null;
        String email = StringUtils.hasText(request.getEmail()) ? request.getEmail().trim() : null;
        String password = request.getPassword();

        if (!StringUtils.hasText(username)) return error("Username is required");
        if (!StringUtils.hasText(email))    return error("Email is required");
        if (!StringUtils.hasText(password)) return error("Password is required");

        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return error("Password must be at least 8 characters and contain an uppercase letter, a number, and a special character");
        }

        if (userRepository.existsByUsername(username)) {
            log.warn("Signup attempt with existing username: {}", username);
            return error("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            log.warn("Signup attempt with existing email for user: {}", username);
            return error("Email already registered");
        }

        User user = new User(username, email, passwordEncoder.encode(password));
        userRepository.save(user);

        log.info("New user registered: {}", username);
        return buildResponse(user);
    }

    // -------------------------------------------------------------------------
    // Login
    // -------------------------------------------------------------------------
    public AuthResponse login(AuthRequest request) {
        if (request == null) {
            return error("Invalid request");
        }

        String username = StringUtils.hasText(request.getUsername()) ? request.getUsername().trim() : null;
        String password = request.getPassword();

        if (!StringUtils.hasText(username)) return error("Username is required");
        if (!StringUtils.hasText(password)) return error("Password is required");

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            log.warn("Failed login attempt for username: {}", username);
            return error("Invalid username or password");
        }

        log.info("Successful login: {}", username);
        return buildResponse(user);
    }

    // -------------------------------------------------------------------------
    // Token refresh
    // -------------------------------------------------------------------------
    public AuthResponse refreshToken(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            return error("Refresh token is required");
        }
        try {
            Claims claims = parseClaims(refreshToken);
            String tokenType = claims.get("type", String.class);
            if (!"refresh".equals(tokenType)) {
                return error("Invalid refresh token");
            }
            String username = claims.getSubject();
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return error("User not found");
            }
            log.info("Token refreshed for: {}", username);
            return buildResponse(user);
        } catch (Exception e) {
            log.debug("Refresh token validation failed: {}", e.getMessage());
            return error("Refresh token expired or invalid");
        }
    }

    // -------------------------------------------------------------------------
    // Token utilities
    // -------------------------------------------------------------------------
    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            // Reject refresh tokens being used as access tokens
            String type = claims.get("type", String.class);
            return !"refresh".equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            return parseClaims(token).getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public String getRoleFromToken(String token) {
        try {
            String role = parseClaims(token).get("role", String.class);
            return role != null ? role : "USER";
        } catch (Exception e) {
            return "USER";
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------
    private AuthResponse buildResponse(User user) {
        String accessToken  = generateToken(user, "access",  expirationMs);
        String refreshToken = generateToken(user, "refresh", refreshExpirationMs);
        return new AuthResponse(accessToken, refreshToken, user.getUsername(), "USER", "Success", true);
    }

    private String generateToken(User user, String type, long ttlMs) {
        SecretKey key = signingKey();
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("type", type)
                .claim("role", "USER")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlMs))
                .signWith(key)
                .compact();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 64) {
            throw new IllegalStateException("JWT secret key must be at least 64 characters long");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private AuthResponse error(String message) {
        return new AuthResponse(null, null, null, null, message, false);
    }
}
