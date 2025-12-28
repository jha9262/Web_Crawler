package com.example.crawler.model;

public class CrawlJobStatus {

    private String jobId;
    private String status; // e.g. QUEUED, RUNNING, COMPLETED
    private int progress; // 0-100
    private int pagesVisited;
    private int pagesQueued;
    private int errors;
    private int avgResponseMs;

    public CrawlJobStatus() {
    }

    public CrawlJobStatus(String jobId, String status, int progress,
                          int pagesVisited, int pagesQueued, int errors, int avgResponseMs) {
        this.jobId = jobId;
        this.status = status;
        this.progress = progress;
        this.pagesVisited = pagesVisited;
        this.pagesQueued = pagesQueued;
        this.errors = errors;
        this.avgResponseMs = avgResponseMs;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
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
}





