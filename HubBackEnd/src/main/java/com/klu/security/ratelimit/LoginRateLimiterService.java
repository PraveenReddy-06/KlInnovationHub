package com.klu.security.ratelimit;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class LoginRateLimiterService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 5;
    private static final int CLEANUP_AFTER_HOURS = 24;
    private LocalDateTime lastCleanup = LocalDateTime.MIN;
    private static final int CLEANUP_INTERVAL_MINUTES = 30;

    private final ConcurrentHashMap<String, LoginAttemptInfo> attempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String email) {
    	cleanupOldEntries();
        LoginAttemptInfo info = attempts.get(email);
        if (info == null) {
            return false;
        }
        if (info.isLocked()) {
            return true;
        }
        if (info.getLockUntil() != null &&!info.isLocked()) {
        	    attempts.remove(email, info);
        }
        return false;
    }

    
    public void loginSucceeded(String email) {
        attempts.remove(email);
    }

    
    public void loginFailed(String email) {
        attempts.compute(email, (key, info) -> {
            if (info == null) {
                info = new LoginAttemptInfo();
            }
            if (info.isLocked()) {
                return info;
            }
            int failedAttempts = info.getFailedAttempts() + 1;
            info.setFailedAttempts(failedAttempts);
            info.setLastFailedTime(LocalDateTime.now());
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                info.setLockUntil( LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
            }
            return info;
        });
    }

    public long getRemainingLockMinutes(String email) {
        LoginAttemptInfo info = attempts.get(email);
        if (info == null || info.getLockUntil() == null) {
            return 0;
        }
        return java.time.Duration.between(LocalDateTime.now(), info.getLockUntil()).toMinutes() + 1;
    }
    

    private synchronized void cleanupOldEntries() {
        LocalDateTime now = LocalDateTime.now();
        if (lastCleanup.plusMinutes(CLEANUP_INTERVAL_MINUTES).isAfter(now)) {
            return;
        }
        attempts.entrySet().removeIf(entry -> {
            LoginAttemptInfo info = entry.getValue();
            if (info.isLocked()) {
                return false;
            }
            if (info.getLastFailedTime() == null) {
                return true;
            }
            return info.getLastFailedTime().plusHours(CLEANUP_AFTER_HOURS).isBefore(now);
        });
        lastCleanup = now;
    }

}