package com.example.crawler.controller;

import com.example.crawler.model.*;
import com.example.crawler.service.CrawlService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crawl")
public class CrawlController {

    private final CrawlService crawlService;

    public CrawlController(CrawlService crawlService) {
        this.crawlService = crawlService;
    }

    /**
     * POST /api/crawl/start
     * Body: CrawlRequest
     * Returns: basic job info you can use in the frontend.
     */
    @PostMapping("/start")
    public ResponseEntity<CrawlJobStatus> start(@Valid @RequestBody CrawlRequest request) {
        CrawlJobStatus status = crawlService.startCrawl(request);
        return ResponseEntity.ok(status);
    }

    /**
     * GET /api/crawl/summary
     * Returns: high-level numbers for the dashboard.
     */
    @GetMapping("/summary")
    public ResponseEntity<CrawlSummary> summary() {
        return ResponseEntity.ok(crawlService.getSummary());
    }

    /**
     * GET /api/crawl/live?jobId=...
     * Returns: live crawl stats for Live Monitor.
     */
    @GetMapping("/live")
    public ResponseEntity<CrawlJobStatus> live(@RequestParam(required = false) String jobId) {
        return ResponseEntity.ok(crawlService.getLiveStatus(jobId));
    }

    /**
     * GET /api/crawl/logs?jobId=...
     * Returns: array of log lines for the terminal view.
     */
    @GetMapping("/logs")
    public ResponseEntity<List<String>> logs(@RequestParam(required = false) String jobId) {
        return ResponseEntity.ok(crawlService.getLiveLogs(jobId));
    }

    /**
     * GET /api/crawl/graph?jobId=...
     * Returns: nodes + links for the graph view.
     */
    @GetMapping("/graph")
    public ResponseEntity<GraphResponse> graph(@RequestParam(required = false) String jobId) {
        return ResponseEntity.ok(crawlService.getGraph(jobId));
    }

    /**
     * GET /api/crawl/analytics?jobId=...
     * Returns: histograms and status rows for analytics page.
     */
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> analytics(@RequestParam(required = false) String jobId) {
        return ResponseEntity.ok(crawlService.getAnalytics(jobId));
    }

    /**
     * Simple health endpoint the frontend can hit if needed.
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}





