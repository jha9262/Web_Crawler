package com.example.crawler.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "crawl_logs")
public class CrawlLog {

    @Id
    private String id;

    private String jobId;

    private Instant timestamp;

    private String message;

    public CrawlLog() {
    }

    public CrawlLog(String jobId, Instant timestamp, String message) {
        this.jobId = jobId;
        this.timestamp = timestamp;
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
