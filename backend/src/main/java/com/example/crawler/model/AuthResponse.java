package com.example.crawler.model;

public class AuthResponse {

    private String token;
    private String refreshToken;
    private String username;
    private String role;
    private String message;
    private boolean success;

    public AuthResponse() {}

    public AuthResponse(String token, String refreshToken, String username, String role, String message, boolean success) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.username = username;
        this.role = role;
        this.message = message;
        this.success = success;
    }

    // Backwards-compatible constructor (without refresh token)
    public AuthResponse(String token, String username, String message, boolean success) {
        this(token, null, username, "USER", message, success);
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
