package com.klu.security.ratelimit;

import java.time.LocalDateTime;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class PasswordResetRateLimiterService {

    private static final int MAX_REQUESTS_PER_HOUR = 5;
    private static final int COOLDOWN_SECONDS = 60;
    private static final int WINDOW_HOURS = 1;
    private static final int CLEANUP_INTERVAL_MINUTES = 30;

    private final ConcurrentHashMap<String, RequestInfo> requests = new ConcurrentHashMap<>();
    private LocalDateTime lastCleanup = LocalDateTime.MIN;

    public RateLimitResult tryRequest(String email) {
        cleanupOldEntries();

        String key = email.trim().toLowerCase();

        RequestInfo info = requests.computeIfAbsent(key, ignored -> new RequestInfo());
        synchronized (info) {
            LocalDateTime now = LocalDateTime.now();
            removeExpiredRequests(info, now);

            if (!info.requestTimes.isEmpty()) {
                LocalDateTime lastRequest = info.requestTimes.peekLast();
                if (lastRequest.plusSeconds(COOLDOWN_SECONDS).isAfter(now)) {
                    return RateLimitResult.blocked();
                }
            }

            if (info.requestTimes.size() >= MAX_REQUESTS_PER_HOUR) {
                return RateLimitResult.blocked();
            }

            info.requestTimes.addLast(now);
            return RateLimitResult.allowed();
        }
    }

    private void removeExpiredRequests(RequestInfo info, LocalDateTime now) {
        LocalDateTime cutoff = now.minusHours(WINDOW_HOURS);
        while (!info.requestTimes.isEmpty() && info.requestTimes.peekFirst().isBefore(cutoff)) {
            info.requestTimes.removeFirst();
        }
    }

    private synchronized void cleanupOldEntries() {
        LocalDateTime now = LocalDateTime.now();

        if (lastCleanup.plusMinutes(CLEANUP_INTERVAL_MINUTES).isAfter(now)) {
            return;
        }

        requests.entrySet().removeIf(entry -> {
            RequestInfo info = entry.getValue();

            synchronized (info) {
                removeExpiredRequests(info, now);
                return info.requestTimes.isEmpty();
            }
        });

        lastCleanup = now;
    }

    public static final class RateLimitResult {

        private final boolean allowed;

        private RateLimitResult(boolean allowed) {
            this.allowed = allowed;
        }

        public boolean isAllowed() {
            return allowed;
        }

        private static RateLimitResult allowed() {
            return new RateLimitResult(true);
        }

        private static RateLimitResult blocked() {
            return new RateLimitResult(false);
        }
    }

    private static final class RequestInfo {
        private final Deque<LocalDateTime> requestTimes = new ArrayDeque<>();
    }
}
