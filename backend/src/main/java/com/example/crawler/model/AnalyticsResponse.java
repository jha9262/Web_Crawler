package com.example.crawler.model;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    // e.g. depth -> pages count
    private Map<String, Long> depthHistogram;
    // e.g. mime -> count
    private Map<String, Long> mimeHistogram;
    // e.g. time bucket label -> avg ms
    private Map<String, Integer> responseTimeline;
    // minimal table rows for the status table
    private List<StatusRow> statusRows;

    public Map<String, Long> getDepthHistogram() {
        return depthHistogram;
    }

    public void setDepthHistogram(Map<String, Long> depthHistogram) {
        this.depthHistogram = depthHistogram;
    }

    public Map<String, Long> getMimeHistogram() {
        return mimeHistogram;
    }

    public void setMimeHistogram(Map<String, Long> mimeHistogram) {
        this.mimeHistogram = mimeHistogram;
    }

    public Map<String, Integer> getResponseTimeline() {
        return responseTimeline;
    }

    public void setResponseTimeline(Map<String, Integer> responseTimeline) {
        this.responseTimeline = responseTimeline;
    }

    public List<StatusRow> getStatusRows() {
        return statusRows;
    }

    public void setStatusRows(List<StatusRow> statusRows) {
        this.statusRows = statusRows;
    }

    public static class StatusRow {
        private String url;
        private int status;
        private String type;
        private int depth;

        public StatusRow() {
        }

        public StatusRow(String url, int status, String type, int depth) {
            this.url = url;
            this.status = status;
            this.type = type;
            this.depth = depth;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public int getStatus() {
            return status;
        }

        public void setStatus(int status) {
            this.status = status;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public int getDepth() {
            return depth;
        }

        public void setDepth(int depth) {
            this.depth = depth;
        }
    }
}





