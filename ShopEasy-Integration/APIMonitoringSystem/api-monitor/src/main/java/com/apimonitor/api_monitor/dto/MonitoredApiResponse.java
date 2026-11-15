package com.apimonitor.api_monitor.dto;

import java.time.LocalDateTime;

public class MonitoredApiResponse {

    private Long id;
    private String name;
    private String targetUrl;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;

    public MonitoredApiResponse(
            Long id,
            String name,
            String targetUrl,
            String description,
            boolean active,
            LocalDateTime createdAt) {

        this.id = id;
        this.name = name;
        this.targetUrl = targetUrl;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public String getDescription() {
        return description;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}