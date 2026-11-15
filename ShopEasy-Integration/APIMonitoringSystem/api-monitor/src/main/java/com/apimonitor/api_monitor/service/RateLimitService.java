
package com.apimonitor.api_monitor.service;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {

    private final StringRedisTemplate redisTemplate;

    // Maximum requests allowed
    private static final int MAX_REQUESTS = 10;

    // Time window in seconds
    private static final long TIME_WINDOW = 60;

    public RateLimitService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Check whether a request is allowed
    public boolean isRequestAllowed(Long apiId, String clientIp) {

        String key = "rate_limit:api:" + apiId + ":ip:" + clientIp;

        Long requestCount = redisTemplate.opsForValue().increment(key);

        if (requestCount == null) {
            return false;
        }

        // Set expiry when the first request arrives
        if (requestCount == 1) {
            redisTemplate.expire(key, Duration.ofSeconds(TIME_WINDOW));
        }

        return requestCount <= MAX_REQUESTS;
    }

    // Get maximum allowed requests
    public int getMaxRequests() {
        return MAX_REQUESTS;
    }

    // Get time window in seconds
    public long getTimeWindowSeconds() {
        return TIME_WINDOW;
    }

    // Get rate limit scope
    public String getRateLimitScope() {
        return "API + IP";
    }
}
