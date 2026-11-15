
package com;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import com.apimonitor.api_monitor.service.RateLimitService;

@ExtendWith(MockitoExtension.class)
class RateLimitServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private RateLimitService rateLimitService;

    @Test
    void shouldAllowFirstTenRequests() {

        String key = "rate_limit:api:1:ip:127.0.0.1";

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        when(valueOperations.increment(key))
                .thenReturn(1L, 2L, 3L, 4L, 5L,
                        6L, 7L, 8L, 9L, 10L);

        for (int i = 1; i <= 10; i++) {
            assertTrue(rateLimitService
                    .isRequestAllowed(1L, "127.0.0.1"));
        }
    }

    @Test
    void shouldRejectEleventhRequest() {

        String key = "rate_limit:api:1:ip:127.0.0.1";

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        when(valueOperations.increment(key))
                .thenReturn(1L, 2L, 3L, 4L, 5L,
                        6L, 7L, 8L, 9L, 10L, 11L);

        for (int i = 1; i <= 10; i++) {
            assertTrue(rateLimitService
                    .isRequestAllowed(1L, "127.0.0.1"));
        }

        assertFalse(rateLimitService
                .isRequestAllowed(1L, "127.0.0.1"));
    }

    @Test
    void shouldSetExpiryOnFirstRequest() {

        String key = "rate_limit:api:1:ip:127.0.0.1";

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        when(valueOperations.increment(key)).thenReturn(1L);

        rateLimitService.isRequestAllowed(1L, "127.0.0.1");

        verify(redisTemplate).expire(key, Duration.ofSeconds(60));
    }

    @Test
    void shouldReturnCorrectConfiguration() {

        assertEquals(10, rateLimitService.getMaxRequests());

        assertEquals(60, rateLimitService.getTimeWindowSeconds());

        assertEquals("API + IP", rateLimitService.getRateLimitScope());
    }
}
