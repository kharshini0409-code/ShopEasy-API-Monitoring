
package com.apimonitor.api_monitor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.apimonitor.api_monitor.entity.ApiMetric;
import com.apimonitor.api_monitor.repository.ApiMetricRepository;
import com.apimonitor.api_monitor.repository.MonitoredApiRepository;

@Service
public class DashboardService {

    private final ApiMetricRepository apiMetricRepository;
    private final MonitoredApiRepository monitoredApiRepository;

    public DashboardService(
            ApiMetricRepository apiMetricRepository,
            MonitoredApiRepository monitoredApiRepository) {

        this.apiMetricRepository = apiMetricRepository;
        this.monitoredApiRepository = monitoredApiRepository;
    }

    // Get overall dashboard statistics
    public Map<String, Object> getDashboardStatistics() {

        List<ApiMetric> metrics = apiMetricRepository.findAll();

        long totalApis = monitoredApiRepository.count();

        long totalRequests = metrics.size();

        long successfulRequests = metrics.stream()
                .filter(ApiMetric::isSuccessful)
                .count();

        long failedRequests = totalRequests - successfulRequests;

        double averageResponseTime = metrics.stream()
                .mapToLong(ApiMetric::getResponseTimeMs)
                .average()
                .orElse(0.0);

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalApis", totalApis);
        dashboard.put("totalRequests", totalRequests);
        dashboard.put("successfulRequests", successfulRequests);
        dashboard.put("failedRequests", failedRequests);
        dashboard.put("averageResponseTimeMs", averageResponseTime);

        return dashboard;
    }
}
