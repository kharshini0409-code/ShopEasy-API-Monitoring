
package com.apimonitor.api_monitor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apimonitor.api_monitor.entity.ApiMetric;
import com.apimonitor.api_monitor.entity.MonitoredApi;
import com.apimonitor.api_monitor.repository.ApiMetricRepository;

@Service
public class MonitoringService {

    private final ApiMetricRepository apiMetricRepository;

    public MonitoringService(ApiMetricRepository apiMetricRepository) {
        this.apiMetricRepository = apiMetricRepository;
    }

    // Save API request metrics
    @Transactional
    public ApiMetric saveMetric(
            MonitoredApi api,
            String httpMethod,
            int statusCode,
            long responseTimeMs,
            String errorMessage) {

        ApiMetric metric = new ApiMetric();

        metric.setMonitoredApi(api);
        metric.setHttpMethod(httpMethod);
        metric.setStatusCode(statusCode);
        metric.setResponseTimeMs(responseTimeMs);
        metric.setSuccessful(statusCode >= 200 && statusCode < 300);
        metric.setErrorMessage(errorMessage);

        return apiMetricRepository.save(metric);
    }

    // Get all metrics for a particular API
 public List<ApiMetric> getMetrics(Long apiId) {

    return apiMetricRepository.findMetricsByApiId(apiId);
}
    // Calculate API statistics
    public Map<String, Object> getStatistics(Long apiId) {

        List<ApiMetric> metrics = getMetrics(apiId);

        long totalRequests = metrics.size();

        long successfulRequests = metrics.stream()
                .filter(ApiMetric::isSuccessful)
                .count();

        long failedRequests = totalRequests - successfulRequests;

        double averageResponseTime = metrics.stream()
                .mapToLong(ApiMetric::getResponseTimeMs)
                .average()
                .orElse(0.0);

        double errorRate = totalRequests == 0
                ? 0.0
                : (failedRequests * 100.0) / totalRequests;

        Map<String, Object> statistics = new HashMap<>();

        statistics.put("apiId", apiId);
        statistics.put("totalRequests", totalRequests);
        statistics.put("successfulRequests", successfulRequests);
        statistics.put("failedRequests", failedRequests);
        statistics.put("averageResponseTimeMs", averageResponseTime);
        statistics.put("errorRatePercentage", errorRate);

        return statistics;
    }
}
