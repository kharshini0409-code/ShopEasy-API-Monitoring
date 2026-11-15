package com.shopeasy.backend.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shopeasy.backend.entity.IntegrationSnapshot;
public interface IntegrationSnapshotRepository extends JpaRepository<IntegrationSnapshot, Long> {
    Optional<IntegrationSnapshot> findByResourceKey(String resourceKey);
    void deleteByResourceKey(String resourceKey);
}
