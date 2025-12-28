package com.example.crawler.repository;

import com.example.crawler.entity.CrawlLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrawlLogRepository extends JpaRepository<CrawlLog, Long> {

    List<CrawlLog> findTop200ByJobIdOrderByTimestampAsc(String jobId);
}





