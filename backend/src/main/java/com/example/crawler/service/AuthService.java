package com.example.crawler.service;

import com.example.crawler.entity.User;
import com.example.crawler.model.AuthRequest;
import com.example.crawler.model.AuthResponse;
import com.example.crawler.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${jwt.secret.key}")
    private String secretKey;
    
    @Value("${jwt.expiration.time:86400000}")
    private long expirationTime;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(AuthRequest request) {
        if (request == null) {
            return new AuthResponse(null, null, "Invalid request", false);
        }
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return new AuthResponse(null, null, "Username is required", false);
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(null, null, "Email is required", false);
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return new AuthResponse(null, null, "Password is required", false);
        }
        if (request.getPassword().length() < 6) {
            return new AuthResponse(null, null, "Password must be at least 6 characters", false);
        }
        
        String username = request.getUsername().trim();
        String email = request.getEmail().trim();
        
        if (userRepository.existsByUsername(username)) {
            return new AuthResponse(null, null, "Username already exists", false);
        }
        if (userRepository.existsByEmail(email)) {
            return new AuthResponse(null, null, "Email already exists", false);
        }

        User user = new User(username, email, request.getPassword());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        String token = generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), "Signup successful", true);
    }

    public AuthResponse login(AuthRequest request) {
        if (request == null) {
            return new AuthResponse(null, null, "Invalid request", false);
        }
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return new AuthResponse(null, null, "Username is required", false);
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new AuthResponse(null, null, "Password is required", false);
        }
        
        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(null, null, "Invalid username or password", false);
        }

        String token = generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), "Login successful", true);
    }

    private String generateToken(String username) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}

