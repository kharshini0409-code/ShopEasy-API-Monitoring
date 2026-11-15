package com.shopeasy.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shopeasy.backend.entity.IntegrationEvent;
public interface IntegrationEventRepository extends JpaRepository<IntegrationEvent, Long> { }
