package com.klu.security.ratelimit;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LoginAttemptInfo {

    private int failedAttempts;
    private LocalDateTime lockUntil;
    private LocalDateTime lastFailedTime;

    public boolean isLocked() {
        return lockUntil != null && LocalDateTime.now().isBefore(lockUntil);
    }

    public void reset() {
        failedAttempts = 0;
        lockUntil = null;
        lastFailedTime = null;
    }
}