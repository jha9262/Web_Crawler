package com.example.crawler.repository;

import com.example.crawler.entity.CrawlJob;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrawlJobRepository extends MongoRepository<CrawlJob, String> {
    Optional<CrawlJob> findTopByOrderByCreatedAtDesc();
}
