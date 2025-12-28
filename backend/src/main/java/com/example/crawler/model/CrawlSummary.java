package com.example.crawler.model;

public class CrawlSummary {

    private long totalPages;
    private long totalErrors;
    private int avgResponseMs;
    private int maxDepth;

    public CrawlSummary() {
    }

    public CrawlSummary(long totalPages, long totalErrors, int avgResponseMs, int maxDepth) {
        this.totalPages = totalPages;
        this.totalErrors = totalErrors;
        this.avgResponseMs = avgResponseMs;
        this.maxDepth = maxDepth;
    }

    public long getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(long totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalErrors() {
        return totalErrors;
    }

    public void setTotalErrors(long totalErrors) {
        this.totalErrors = totalErrors;
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
}





