package com.apimonitor.api_monitor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MonitoredApiRequest {

    @NotBlank(message = "API name is required")
    private String name;

    @NotBlank(message = "Target URL is required")
    @Size(max = 1000, message = "URL is too long")
    private String targetUrl;

    private String description;

    public String getName() {
        return name;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}