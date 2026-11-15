
package com.apimonitor.api_monitor.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apimonitor.api_monitor.dto.MonitoredApiRequest;
import com.apimonitor.api_monitor.dto.MonitoredApiResponse;
import com.apimonitor.api_monitor.entity.MonitoredApi;
import com.apimonitor.api_monitor.repository.MonitoredApiRepository;

@Service
public class MonitoredApiService {

    private final MonitoredApiRepository repository;

    public MonitoredApiService(MonitoredApiRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public MonitoredApiResponse createApi(MonitoredApiRequest request) {

        MonitoredApi api = new MonitoredApi();

        api.setName(request.getName());
        api.setTargetUrl(request.getTargetUrl());
        api.setDescription(request.getDescription());
        api.setActive(true);

        MonitoredApi savedApi = repository.save(api);

        return convertToResponse(savedApi);
    }

    public List<MonitoredApiResponse> getAllApis() {

        return repository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public MonitoredApiResponse getApiById(Long id) {

        MonitoredApi api = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("API not found with ID: " + id));

        return convertToResponse(api);
    }

    @Transactional
    public MonitoredApiResponse updateApi(
            Long id,
            MonitoredApiRequest request) {

        MonitoredApi api = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("API not found with ID: " + id));

        api.setName(request.getName());
        api.setTargetUrl(request.getTargetUrl());
        api.setDescription(request.getDescription());

        return convertToResponse(repository.save(api));
    }

    @Transactional
    public void deleteApi(Long id) {

        MonitoredApi api = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("API not found with ID: " + id));

        api.setActive(false);

        repository.save(api);
    }

    private MonitoredApiResponse convertToResponse(MonitoredApi api) {

        return new MonitoredApiResponse(
                api.getId(),
                api.getName(),
                api.getTargetUrl(),
                api.getDescription(),
                api.isActive(),
                api.getCreatedAt()
        );
    }
}
