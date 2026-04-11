package com.example.crawler.repository;

import com.example.crawler.entity.CrawlLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrawlLogRepository extends MongoRepository<CrawlLog, String> {
    List<CrawlLog> findTop200ByJobIdOrderByTimestampAsc(String jobId);
}
