
package com.apimonitor.api_monitor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apimonitor.api_monitor.entity.ApiMetric;

@Repository
public interface ApiMetricRepository
        extends JpaRepository<ApiMetric, Long> {

    @Query("SELECT m FROM ApiMetric m " +
           "WHERE m.monitoredApi.id = :apiId " +
           "ORDER BY m.timestamp DESC")
    List<ApiMetric> findMetricsByApiId(
            @Param("apiId") Long apiId
    );
}
