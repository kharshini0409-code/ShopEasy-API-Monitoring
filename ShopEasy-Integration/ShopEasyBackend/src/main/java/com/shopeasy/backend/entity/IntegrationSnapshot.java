package com.shopeasy.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "shopeasy_integration_snapshots", uniqueConstraints = @UniqueConstraint(name = "uk_snapshot_resource", columnNames = "resource_key"))
public class IntegrationSnapshot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "resource_key", nullable = false, unique = true, length = 80)
    private String resourceKey;
    @Column(name = "payload_json", nullable = false, columnDefinition = "TEXT")
    private String payloadJson;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    void updateTimestamp() { updatedAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public String getResourceKey() { return resourceKey; }
    public void setResourceKey(String resourceKey) { this.resourceKey = resourceKey; }
    public String getPayloadJson() { return payloadJson; }
    public void setPayloadJson(String payloadJson) { this.payloadJson = payloadJson; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
