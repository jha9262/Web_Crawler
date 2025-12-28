package com.example.crawler.service;

import com.example.crawler.entity.CrawlJob;
import com.example.crawler.entity.CrawlLog;
import com.example.crawler.model.*;
import com.example.crawler.repository.CrawlJobRepository;
import com.example.crawler.repository.CrawlLogRepository;
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

    /**
     * Start a new crawl job and simulate progress asynchronously.
     * In a real implementation, you would call your crawler engine here instead
     * of the simulateCrawl(...) method.
     */
    @Transactional
    public CrawlJobStatus startCrawl(CrawlRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Crawl request cannot be null");
        }
        if (request.getUrl() == null || request.getUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("URL is required");
        }
        
        CrawlJob job = new CrawlJob();
        job.setUrl(request.getUrl().trim());
        job.setMaxDepth(Math.max(1, Math.min(10, request.getMaxDepth()))); // Clamp between 1-10
        job.setRestrictToDomain(request.isRestrictToDomain());
        job.setSpeed(request.getSpeed() != null ? request.getSpeed() : "medium");
        job.setExtractMetadata(request.isExtractMetadata());
        job.setStatus("QUEUED");
        job.setProgress(0);
        CrawlJob saved = jobRepository.save(job);

        // Kick off simulation in background
        crawlExecutor.execute(() -> simulateCrawl(saved.getId()));

        return mapToStatus(saved);
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
        CrawlJob job = resolveJob(jobId);
        return mapToStatus(job);
    }

    public List<String> getLiveLogs(String jobId) {
        CrawlJob job = resolveJob(jobId);
        return logRepository.findTop200ByJobIdOrderByTimestampAsc(job.getId())
                .stream()
                .map(CrawlLog::getMessage)
                .toList();
    }

    public GraphResponse getGraph(String jobId) {
        // Still returns demo graph for now; you can persist nodes/links per job
        // later and build this from your database instead.
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
        // Still returns demo analytics for now; wire this to real aggregates from DB later.
        AnalyticsResponse resp = new AnalyticsResponse();
        resp.setDepthHistogram(Map.of(
                "1", 58L,
                "2", 142L,
                "3", 310L,
                "4", 210L,
                "5+", 89L
        ));
        resp.setMimeHistogram(Map.of(
                "HTML", 480L,
                "Images", 210L,
                "CSS", 66L,
                "JS", 128L
        ));
        resp.setResponseTimeline(Map.of(
                "t0", 180,
                "t1", 220,
                "t2", 160,
                "t3", 210,
                "t4", 260,
                "t5", 190,
                "t6", 205,
                "t7", 175
        ));

        List<AnalyticsResponse.StatusRow> rows = List.of(
                new AnalyticsResponse.StatusRow("/", 200, "HTML", 1),
                new AnalyticsResponse.StatusRow("/blog", 200, "HTML", 2),
                new AnalyticsResponse.StatusRow("/blog/legacy", 404, "HTML", 3),
                new AnalyticsResponse.StatusRow("/api/internal", 500, "JSON", 2),
                new AnalyticsResponse.StatusRow("/pricing", 200, "HTML", 2),
                new AnalyticsResponse.StatusRow("/cdn/logo.png", 200, "Image", 2),
                new AnalyticsResponse.StatusRow("/static/old.css", 301, "CSS", 3)
        );
        resp.setStatusRows(rows);
        return resp;
    }

    private CrawlJob resolveJob(String jobId) {
        if (jobId != null && !jobId.isBlank()) {
            return jobRepository.findById(jobId)
                    .orElseThrow(() -> new IllegalArgumentException("Unknown jobId " + jobId));
        }
        return jobRepository.findTopByOrderByCreatedAtDesc()
                .orElseThrow(() -> new IllegalStateException("No crawl jobs found yet."));
    }

    /**
     * Very simple simulated crawler that updates job progress, counters, and logs.
     * Replace this with your actual crawling implementation.
     */
    @Transactional
    protected void simulateCrawl(String jobId) {
        try {
            CrawlJob job = jobRepository.findById(jobId).orElseThrow();
            job.setStatus("RUNNING");
            jobRepository.save(job);
            log("INIT     ┊ bootstrap crawler session   ┊ seed=%s".formatted(job.getUrl()), jobId);

            int totalSteps = 20;
            for (int i = 1; i <= totalSteps; i++) {
                Thread.sleep(1000L);
                job = jobRepository.findById(jobId).orElseThrow();
                job.setProgress((i * 100) / totalSteps);
                job.setPagesVisited(job.getPagesVisited() + (int) (Math.random() * 20) + 5);
                job.setPagesQueued(Math.max(0, job.getPagesQueued() + (int) (Math.random() * 10) - 5));
                if (Math.random() < 0.2) {
                    job.setErrors(job.getErrors() + 1);
                    log("ERROR    ┊ simulated 5xx response         ┊ /api/legacy", jobId);
                } else {
                    log("VISIT    ┊ GET 200 %3dms              ┊ /page-%d"
                            .formatted(100 + (int) (Math.random() * 200), job.getPagesVisited()), jobId);
                }
                job.setAvgResponseMs(150 + (int) (Math.random() * 120));
                jobRepository.save(job);
            }
            job = jobRepository.findById(jobId).orElseThrow();
            job.setStatus("COMPLETED");
            job.setProgress(100);
            jobRepository.save(job);
            log("DONE     ┊ crawl completed                ┊ visited=%d, errors=%d"
                    .formatted(job.getPagesVisited(), job.getErrors()), jobId);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        } catch (Exception ex) {
            log("ERROR    ┊ simulation failed: " + ex.getMessage(), jobId);
        }
    }

    private void log(String message, String jobId) {
        CrawlLog log = new CrawlLog(jobId, Instant.now(), "[%s] %s"
                .formatted(Instant.now().toString(), message));
        logRepository.save(log);
    }
}


