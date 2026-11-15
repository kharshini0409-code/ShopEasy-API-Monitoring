
package com.apimonitor.api_monitor.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apimonitor.api_monitor.dto.MonitoredApiRequest;
import com.apimonitor.api_monitor.dto.MonitoredApiResponse;
import com.apimonitor.api_monitor.service.MonitoredApiService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/monitored-apis")
public class MonitoredApiController {

    private final MonitoredApiService service;

    public MonitoredApiController(MonitoredApiService service) {
        this.service = service;
    }

    // Create a new monitored API
    @PostMapping
    public ResponseEntity<MonitoredApiResponse> createApi(
            @Valid @RequestBody MonitoredApiRequest request) {

        MonitoredApiResponse response = service.createApi(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all monitored APIs
    @GetMapping
    public ResponseEntity<List<MonitoredApiResponse>> getAllApis() {

        List<MonitoredApiResponse> apis = service.getAllApis();

        return ResponseEntity.ok(apis);
    }

    // Get API by ID
    @GetMapping("/{id}")
    public ResponseEntity<MonitoredApiResponse> getApiById(
            @PathVariable Long id) {

        MonitoredApiResponse response = service.getApiById(id);

        return ResponseEntity.ok(response);
    }

    // Update an API
    @PutMapping("/{id}")
    public ResponseEntity<MonitoredApiResponse> updateApi(
            @PathVariable Long id,
            @Valid @RequestBody MonitoredApiRequest request) {

        MonitoredApiResponse response = service.updateApi(id, request);

        return ResponseEntity.ok(response);
    }

    // Soft delete an API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApi(@PathVariable Long id) {

        service.deleteApi(id);

        return ResponseEntity.noContent().build();
    }
}
