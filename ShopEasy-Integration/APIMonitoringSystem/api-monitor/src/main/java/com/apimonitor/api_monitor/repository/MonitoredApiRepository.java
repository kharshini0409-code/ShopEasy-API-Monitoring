
package com.apimonitor.api_monitor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apimonitor.api_monitor.entity.MonitoredApi;

@Repository
public interface MonitoredApiRepository
        extends JpaRepository<MonitoredApi, Long> {

    List<MonitoredApi> findByActiveTrue();

}

