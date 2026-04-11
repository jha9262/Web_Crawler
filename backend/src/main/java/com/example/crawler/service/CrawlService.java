package com.example.crawler.service;

import com.example.crawler.entity.CrawlJob;
import com.example.crawler.entity.CrawlLog;
import com.example.crawler.model.*;
import com.example.crawler.repository.CrawlJobRepository;
import com.example.crawler.repository.CrawlLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Executor;

@Service
public class CrawlService {

    private static final Logger log = LoggerFactory.getLogger(CrawlService.class);

    private final CrawlJobRepository jobRepository;
    private final CrawlLogRepository logRepository;
    private final Executor crawlExecutor;

    public CrawlService(CrawlJobRepository jobRepository,
                        CrawlLogRepository logRepository,
                        @Qualifier("crawlExecutor") Executor crawlExecutor) {
        this.jobRepository = jobRepository;
        this.logRepository = logRepository;
        this.crawlExecutor = crawlExecutor;
    }

    // -------------------------------------------------------------------------
    // Start Crawl
    // -------------------------------------------------------------------------
    @Transactional
    public CrawlJobStatus startCrawl(CrawlRequest request) {
        if (request == null) throw new IllegalArgumentException("Crawl request cannot be null");
        if (request.getUrl() == null || request.getUrl().isBlank()) throw new IllegalArgumentException("URL is required");

        CrawlJob job = new CrawlJob();
        job.setUrl(request.getUrl().trim());
        job.setMaxDepth(Math.max(1, Math.min(10, request.getMaxDepth())));
        job.setRestrictToDomain(request.isRestrictToDomain());
        job.setSpeed(request.getSpeed() != null ? request.getSpeed() : "medium");
        job.setExtractMetadata(request.isExtractMetadata());
        job.setStatus("QUEUED");
        job.setProgress(0);

        CrawlJob saved = jobRepository.save(job);
        log.info("Crawl job created [jobId={}] for URL: {}", saved.getId(), saved.getUrl());

        crawlExecutor.execute(() -> simulateCrawl(saved.getId()));
        return mapToStatus(saved);
    }

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------
    public CrawlSummary getSummary() {
        Optional<CrawlJob> latest = jobRepository.findTopByOrderByCreatedAtDesc();
        return latest
                .map(job -> new CrawlSummary(
                        job.getPagesVisited() + job.getPagesQueued(),
                        job.getErrors(),
                        job.getAvgResponseMs(),
                        job.getMaxDepth()
                ))
                .orElseGet(() -> new CrawlSummary(0L, 0L, 0, 0));
    }

    public CrawlJobStatus getLiveStatus(String jobId) {
        return mapToStatus(resolveJob(jobId));
    }

    public List<String> getLiveLogs(String jobId) {
        CrawlJob job = resolveJob(jobId);
        return logRepository.findTop200ByJobIdOrderByTimestampAsc(job.getId())
                .stream()
                .map(CrawlLog::getMessage)
                .toList();
    }

    public GraphResponse getGraph(String jobId) {
        // TODO: Persist real crawl graph nodes/links per job and query from DB
        List<GraphNode> nodes = List.of(
                new GraphNode("home", "Home", "home"),
                new GraphNode("blog", "Blog", "internal"),
                new GraphNode("pricing", "Pricing", "internal"),
                new GraphNode("status", "Status", "internal"),
                new GraphNode("404", "404", "error"),
                new GraphNode("external-docs", "Docs", "external")
        );
        List<GraphLink> links = List.of(
                new GraphLink("home", "blog"),
                new GraphLink("home", "pricing"),
                new GraphLink("home", "status"),
                new GraphLink("blog", "404"),
                new GraphLink("blog", "external-docs"),
                new GraphLink("pricing", "status")
        );
        return new GraphResponse(nodes, links);
    }

    public AnalyticsResponse getAnalytics(String jobId) {
        // TODO: Replace with real DB aggregations per job
        AnalyticsResponse resp = new AnalyticsResponse();
        resp.setDepthHistogram(Map.of("1", 58L, "2", 142L, "3", 310L, "4", 210L, "5+", 89L));
        resp.setMimeHistogram(Map.of("HTML", 480L, "Images", 210L, "CSS", 66L, "JS", 128L));
        resp.setResponseTimeline(Map.of(
                "t0", 180, "t1", 220, "t2", 160, "t3", 210,
                "t4", 260, "t5", 190, "t6", 205, "t7", 175
        ));
        resp.setStatusRows(List.of(
                new AnalyticsResponse.StatusRow("/", 200, "HTML", 1),
                new AnalyticsResponse.StatusRow("/blog", 200, "HTML", 2),
                new AnalyticsResponse.StatusRow("/blog/legacy", 404, "HTML", 3),
                new AnalyticsResponse.StatusRow("/api/internal", 500, "JSON", 2),
                new AnalyticsResponse.StatusRow("/pricing", 200, "HTML", 2),
                new AnalyticsResponse.StatusRow("/cdn/logo.png", 200, "Image", 2),
                new AnalyticsResponse.StatusRow("/static/old.css", 301, "CSS", 3)
        ));
        return resp;
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------
    private CrawlJob resolveJob(String jobId) {
        if (jobId != null && !jobId.isBlank()) {
            return jobRepository.findById(jobId)
                    .orElseThrow(() -> new IllegalArgumentException("Unknown jobId: " + jobId));
        }
        return jobRepository.findTopByOrderByCreatedAtDesc()
                .orElseThrow(() -> new IllegalStateException("No crawl jobs found yet. Start a crawl first."));
    }

    private CrawlJobStatus mapToStatus(CrawlJob job) {
        return new CrawlJobStatus(
                job.getId(),
                job.getStatus(),
                job.getProgress(),
                job.getPagesVisited(),
                job.getPagesQueued(),
                job.getErrors(),
                job.getAvgResponseMs()
        );
    }

    /**
     * Simulated crawl running in a background thread.
     * Each DB operation is done in its own transaction (no @Transactional on this method
     * because it runs in a different thread from the caller's transaction).
     */
    protected void simulateCrawl(String jobId) {
        try {
            CrawlJob job = jobRepository.findById(jobId).orElseThrow();
            job.setStatus("RUNNING");
            jobRepository.save(job);
            appendLog("INIT     | bootstrap crawler session   | seed=" + job.getUrl(), jobId);

            int totalSteps = 20;
            for (int i = 1; i <= totalSteps; i++) {
                Thread.sleep(1000L);
                job = jobRepository.findById(jobId).orElseThrow();
                job.setProgress((i * 100) / totalSteps);
                job.setPagesVisited(job.getPagesVisited() + (int) (Math.random() * 20) + 5);
                job.setPagesQueued(Math.max(0, job.getPagesQueued() + (int) (Math.random() * 10) - 5));

                if (Math.random() < 0.2) {
                    job.setErrors(job.getErrors() + 1);
                    appendLog("ERROR    | simulated 5xx response       | /api/legacy", jobId);
                } else {
                    appendLog(String.format("VISIT    | GET 200 %3dms              | /page-%d",
                            100 + (int) (Math.random() * 200), job.getPagesVisited()), jobId);
                }
                job.setAvgResponseMs(150 + (int) (Math.random() * 120));
                jobRepository.save(job);
            }

            job = jobRepository.findById(jobId).orElseThrow();
            job.setStatus("COMPLETED");
            job.setProgress(100);
            jobRepository.save(job);
            appendLog(String.format("DONE     | crawl completed            | visited=%d errors=%d",
                    job.getPagesVisited(), job.getErrors()), jobId);

            log.info("Crawl job completed [jobId={}] visited={} errors={}", jobId, job.getPagesVisited(), job.getErrors());

        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            log.warn("Crawl job interrupted [jobId={}]", jobId);
        } catch (Exception ex) {
            log.error("Crawl simulation failed [jobId={}]", jobId, ex);
            appendLog("ERROR    | simulation failed: " + ex.getMessage(), jobId);
        }
    }

    private void appendLog(String message, String jobId) {
        CrawlLog entry = new CrawlLog(jobId, Instant.now(),
                "[" + Instant.now() + "] " + message);
        logRepository.save(entry);
    }
}
