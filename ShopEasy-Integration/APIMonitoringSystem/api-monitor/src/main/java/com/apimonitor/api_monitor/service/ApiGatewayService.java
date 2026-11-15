package com.apimonitor.api_monitor.service;

import java.net.URI;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.apimonitor.api_monitor.entity.MonitoredApi;
import com.apimonitor.api_monitor.repository.MonitoredApiRepository;

@Service
public class ApiGatewayService {
    private final MonitoredApiRepository monitoredApiRepository;
    private final MonitoringService monitoringService;
    private final RateLimitService rateLimitService;
    private final RestClient restClient;

    public ApiGatewayService(MonitoredApiRepository monitoredApiRepository,
            MonitoringService monitoringService, RateLimitService rateLimitService,
            RestClient restClient) {
        this.monitoredApiRepository = monitoredApiRepository;
        this.monitoringService = monitoringService;
        this.rateLimitService = rateLimitService;
        this.restClient = restClient;
    }

    public ResponseEntity<byte[]> forwardRequest(Long apiId, HttpMethod method,
            byte[] requestBody, String clientIp, String pathAndQuery,
            Map<String, String> incomingHeaders) {
        MonitoredApi api = monitoredApiRepository.findById(apiId)
                .orElseThrow(() -> new IllegalArgumentException("API not found: " + apiId));
        if (!api.isActive()) throw new IllegalStateException("API is inactive: " + apiId);

        if (!rateLimitService.isRequestAllowed(apiId, clientIp)) {
            monitoringService.saveMetric(api, method.name(), 429, 0, "Rate limit exceeded");
            return ResponseEntity.status(429)
                    .header("Retry-After", String.valueOf(rateLimitService.getTimeWindowSeconds()))
                    .body("Rate limit exceeded. Try again later.".getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }

        String baseUrl = api.getTargetUrl().replaceAll("/+$", "");
        String suffix = (pathAndQuery == null || pathAndQuery.isBlank()) ? "/" : pathAndQuery;
        URI targetUri = URI.create(baseUrl + (suffix.startsWith("/") ? suffix : "/" + suffix));
        long startTime = System.nanoTime();

        try {
            ResponseEntity<byte[]> response = restClient.method(method)
                    .uri(targetUri)
                    .headers(headers -> copyRequestHeaders(incomingHeaders, headers))
                    .body(requestBody == null ? new byte[0] : requestBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), (request, apiResponse) -> { /* preserve target status/body */ })
                    .toEntity(byte[].class);

            long elapsed = (System.nanoTime() - startTime) / 1_000_000;
            monitoringService.saveMetric(api, method.name(), response.getStatusCode().value(), elapsed,
                    response.getStatusCode().isError() ? "Target returned HTTP " + response.getStatusCode().value() : null);

            HttpHeaders outgoing = new HttpHeaders();
            response.getHeaders().forEach((name, values) -> {
                if (!name.equalsIgnoreCase("transfer-encoding") && !name.equalsIgnoreCase("connection")
                        && !name.equalsIgnoreCase("content-length") && !name.toLowerCase().startsWith("access-control-")) outgoing.put(name, values);
            });
            return new ResponseEntity<>(response.getBody(), outgoing, response.getStatusCode());
        } catch (RestClientException | IllegalArgumentException exception) {
            long elapsed = (System.nanoTime() - startTime) / 1_000_000;
            monitoringService.saveMetric(api, method.name(), 502, elapsed, exception.getMessage());
            return ResponseEntity.status(502)
                    .body(("Target API is unavailable: " + exception.getMessage())
                            .getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
    }

    private void copyRequestHeaders(Map<String, String> source, HttpHeaders target) {
        source.forEach((name, value) -> {
            if (!name.equalsIgnoreCase("host") && !name.equalsIgnoreCase("content-length")
                    && !name.equalsIgnoreCase("connection") && !name.equalsIgnoreCase("accept-encoding")) {
                target.set(name, value);
            }
        });
    }
}
