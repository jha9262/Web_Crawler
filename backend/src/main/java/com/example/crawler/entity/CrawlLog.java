package com.example.crawler.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "crawl_log")
public class CrawlLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 36, nullable = false)
    private String jobId;

    @Column(nullable = false)
    private Instant timestamp;

    @Column(nullable = false, length = 512)
    private String message;

    public CrawlLog() {
    }

    public CrawlLog(String jobId, Instant timestamp, String message) {
        this.jobId = jobId;
        this.timestamp = timestamp;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}





