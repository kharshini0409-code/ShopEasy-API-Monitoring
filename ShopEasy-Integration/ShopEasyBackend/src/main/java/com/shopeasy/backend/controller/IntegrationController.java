package com.shopeasy.backend.controller;

import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopeasy.backend.entity.IntegrationEvent;
import com.shopeasy.backend.entity.IntegrationSnapshot;
import com.shopeasy.backend.repository.IntegrationEventRepository;
import com.shopeasy.backend.repository.IntegrationSnapshotRepository;

@RestController
@RequestMapping("/api/integration")
public class IntegrationController {
    private static final Set<String> ALLOWED_RESOURCES = Set.of(
        "customers", "products", "cart", "wishlist", "orders", "reviews",
        "current-session", "latest-order", "admin-session"
    );
    private final IntegrationSnapshotRepository snapshots;
    private final IntegrationEventRepository events;
    private final ObjectMapper mapper;

    public IntegrationController(IntegrationSnapshotRepository snapshots,
            IntegrationEventRepository events, ObjectMapper mapper) {
        this.snapshots = snapshots; this.events = events; this.mapper = mapper;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "service", "ShopEasy Backend", "integration", "API Gateway ready");
    }

    @PutMapping("/snapshots/{resource}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void upsertSnapshot(@PathVariable String resource, @RequestBody Object payload) {
        validateResource(resource);
        try {
            IntegrationSnapshot snapshot = snapshots.findByResourceKey(resource).orElseGet(IntegrationSnapshot::new);
            snapshot.setResourceKey(resource);
            snapshot.setPayloadJson(mapper.writeValueAsString(payload));
            snapshots.save(snapshot);
            saveEvent("SNAPSHOT_UPDATED", resource, payload);
        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON payload");
        }
    }

    @GetMapping("/snapshots/{resource}")
    public Map<String, Object> getSnapshot(@PathVariable String resource) {
        validateResource(resource);
        IntegrationSnapshot snapshot = snapshots.findByResourceKey(resource)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Snapshot not found"));
        try { return Map.of("resource", resource, "payload", mapper.readValue(snapshot.getPayloadJson(), Object.class), "updatedAt", snapshot.getUpdatedAt()); }
        catch (JsonProcessingException ex) { throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Stored snapshot is invalid"); }
    }

    @DeleteMapping("/snapshots/{resource}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSnapshot(@PathVariable String resource) {
        validateResource(resource);
        snapshots.deleteByResourceKey(resource);
        saveEvent("SNAPSHOT_DELETED", resource, Map.of());
    }

    @PostMapping("/events")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Map<String, Object> recordEvent(@RequestBody Map<String, Object> body) {
        String type = String.valueOf(body.getOrDefault("eventType", "CLIENT_EVENT"));
        String resource = String.valueOf(body.getOrDefault("resource", "general"));
        saveEvent(type, resource, body);
        return Map.of("accepted", true);
    }

    @GetMapping("/events")
    public java.util.List<Map<String, Object>> recentEvents() {
        return events.findAll(org.springframework.data.domain.PageRequest.of(0, 100,
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")))
            .stream().map(e -> Map.<String, Object>of("id", e.getId(), "eventType", e.getEventType(),
                "resource", e.getResourceKey() == null ? "" : e.getResourceKey(),
                "details", e.getDetailsJson() == null ? "{}" : e.getDetailsJson(), "createdAt", e.getCreatedAt())).toList();
    }

    private void validateResource(String resource) {
        if (!ALLOWED_RESOURCES.contains(resource)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported resource");
    }
    private void saveEvent(String type, String resource, Object details) {
        try {
            IntegrationEvent event = new IntegrationEvent();
            event.setEventType(type); event.setResourceKey(resource);
            event.setDetailsJson(mapper.writeValueAsString(details));
            events.save(event);
        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid event details");
        }
    }
}
