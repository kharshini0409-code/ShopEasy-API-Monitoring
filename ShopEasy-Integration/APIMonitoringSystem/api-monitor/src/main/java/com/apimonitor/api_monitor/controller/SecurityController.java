
package com.apimonitor.api_monitor.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apimonitor.api_monitor.service.RateLimitService;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final RateLimitService rateLimitService;

    public SecurityController(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    // Get actual rate-limiting configuration
    @GetMapping("/configuration")
    public ResponseEntity<Map<String, Object>> getSecurityConfiguration() {

        Map<String, Object> configuration = new HashMap<>();

        configuration.put(
            "maximumRequests",
            rateLimitService.getMaxRequests()
        );

        configuration.put(
            "timeWindowSeconds",
            rateLimitService.getTimeWindowSeconds()
        );

        configuration.put(
            "rateLimitScope",
            rateLimitService.getRateLimitScope()
        );

        configuration.put(
            "rateLimitStorage",
            "Redis"
        );

        return ResponseEntity.ok(configuration);
    }
}
