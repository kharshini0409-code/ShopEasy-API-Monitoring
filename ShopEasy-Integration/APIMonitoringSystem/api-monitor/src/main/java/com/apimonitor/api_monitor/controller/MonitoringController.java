
package com.apimonitor.api_monitor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apimonitor.api_monitor.entity.ApiMetric;
import com.apimonitor.api_monitor.service.MonitoringService;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    // Get all request metrics for an API
    @GetMapping("/{apiId}/metrics")
    public List<ApiMetric> getMetrics(@PathVariable Long apiId) {

        return monitoringService.getMetrics(apiId);
    }

    // Get statistics for an API
    @GetMapping("/{apiId}/statistics")
    public Map<String, Object> getStatistics(
            @PathVariable Long apiId) {

        return monitoringService.getStatistics(apiId);
    }
}
