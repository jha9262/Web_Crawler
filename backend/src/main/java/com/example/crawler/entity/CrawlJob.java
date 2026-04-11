package com.example.crawler.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "crawl_jobs")
public class CrawlJob {

    @Id
    private String id;

    private String url;
    private Instant createdAt;
    private String status; // QUEUED, RUNNING, COMPLETED
    private int progress;
    private int pagesVisited;
    private int pagesQueued;
    private int errors;
    private int avgResponseMs;

    private int maxDepth;
    private boolean restrictToDomain;
    private String speed;
    private boolean extractMetadata;

    public CrawlJob() {
        this.id = java.util.UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.status = "QUEUED";
        this.progress = 0;
        this.pagesVisited = 0;
        this.pagesQueued = 0;
        this.errors = 0;
        this.avgResponseMs = 0;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }
        this.url = url.trim();
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        if (progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }
        this.progress = progress;
    }

    public int getPagesVisited() {
        return pagesVisited;
    }

    public void setPagesVisited(int pagesVisited) {
        this.pagesVisited = pagesVisited;
    }

    public int getPagesQueued() {
        return pagesQueued;
    }

    public void setPagesQueued(int pagesQueued) {
        this.pagesQueued = pagesQueued;
    }

    public int getErrors() {
        return errors;
    }

    public void setErrors(int errors) {
        this.errors = errors;
    }

    public int getAvgResponseMs() {
        return avgResponseMs;
    }

    public void setAvgResponseMs(int avgResponseMs) {
        this.avgResponseMs = avgResponseMs;
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
