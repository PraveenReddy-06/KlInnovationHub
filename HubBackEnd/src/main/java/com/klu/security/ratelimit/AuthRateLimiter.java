package com.klu.security.ratelimit;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthRateLimiter {

    private static final long MINUTE = TimeUnit.MINUTES.toMillis(1);
    public static final String LOGIN_LIMIT_MESSAGE = "Too many sign-in attempts. Please wait a few minutes and try again.";

    public enum Action {
        LOGIN(5, 5 * MINUTE, 0),
        SIGNUP_ISSUE(5, 60 * MINUTE, MINUTE),
        SIGNUP_VERIFY(5, 3 * MINUTE, 0),
        RESET_ISSUE(5, 60 * MINUTE, MINUTE),
        RESET_VERIFY(5, 3 * MINUTE, 0),
        RESET_COMPLETE(5, 5 * MINUTE, 0);

        private final int limit;
        private final long window;
        private final long cooldown;

        Action(int limit, long window, long cooldown) {
            this.limit = limit;
            this.window = window;
            this.cooldown = cooldown;
        }
    }

    private final JdbcTemplate jdbc;

    public AuthRateLimiter(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public boolean acquire(Action action, String identifier) {
        String key = bucketKey(action, identifier);
        // The upsert also locks the row when a second instance creates the same bucket.
        jdbc.update("""
                INSERT INTO auth_rate_limit (bucket_key, attempt_count, expires_at, next_allowed_at)
                VALUES (?, 0, 0, 0)
                ON DUPLICATE KEY UPDATE bucket_key = bucket_key
                """, key);
        Bucket bucket = jdbc.queryForObject("""
                SELECT attempt_count, expires_at, next_allowed_at
                FROM auth_rate_limit
                WHERE bucket_key = ?
                FOR UPDATE
                """, (row, index) -> new Bucket(row.getInt(1), row.getLong(2), row.getLong(3)), key);
        long now = System.currentTimeMillis();
        if (bucket.expiresAt() <= now) {
            bucket = new Bucket(0, now + action.window, 0);
        }
        if (bucket.count() >= action.limit || now < bucket.nextAllowedAt()) {
            return false;
        }
        jdbc.update("""
                UPDATE auth_rate_limit
                SET attempt_count = ?, expires_at = ?, next_allowed_at = ?
                WHERE bucket_key = ?
                """, bucket.count() + 1, bucket.expiresAt(), now + action.cooldown, key);
        return true;
    }

    @Transactional
    public void clearLogin(String email) {
        jdbc.update("DELETE FROM auth_rate_limit WHERE bucket_key = ?", bucketKey(Action.LOGIN, email));
    }

    @Scheduled(fixedDelay = 30, timeUnit = TimeUnit.MINUTES)
    public void pruneExpired() {
        jdbc.update("DELETE FROM auth_rate_limit WHERE expires_at <= ?", System.currentTimeMillis());
    }

    private static String bucketKey(Action action, String identifier) {
        String normalized = action.name() + ":" + identifier.strip().toLowerCase(Locale.ROOT);
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(normalized.getBytes(StandardCharsets.UTF_8)));
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }

    private record Bucket(int count, long expiresAt, long nextAllowedAt) {}
}
