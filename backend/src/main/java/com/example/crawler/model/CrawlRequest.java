package com.example.crawler.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CrawlRequest {

    @NotBlank(message = "URL is required")
    @Pattern(regexp = "^https?://.*", message = "URL must start with http:// or https://")
    private String url;
    
    @Min(value = 1, message = "Max depth must be at least 1")
    @Max(value = 10, message = "Max depth cannot exceed 10")
    private int maxDepth;
    
    private boolean restrictToDomain;
    
    private String speed;
    
    private boolean extractMetadata;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getMaxDepth() {
        return maxDepth;
    }

    public void setMaxDepth(int maxDepth) {
        this.maxDepth = maxDepth;
    }

    public boolean isRestrictToDomain() {
        return restrictToDomain;
    }

    public void setRestrictToDomain(boolean restrictToDomain) {
        this.restrictToDomain = restrictToDomain;
    }

    public String getSpeed() {
        return speed;
    }

    public void setSpeed(String speed) {
        this.speed = speed;
    }

    public boolean isExtractMetadata() {
        return extractMetadata;
    }

    public void setExtractMetadata(boolean extractMetadata) {
        this.extractMetadata = extractMetadata;
    }
}





