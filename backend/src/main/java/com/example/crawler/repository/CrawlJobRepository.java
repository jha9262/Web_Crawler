package com.example.crawler.repository;

import com.example.crawler.entity.CrawlJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CrawlJobRepository extends JpaRepository<CrawlJob, String> {

    Optional<CrawlJob> findTopByOrderByCreatedAtDesc();
}





