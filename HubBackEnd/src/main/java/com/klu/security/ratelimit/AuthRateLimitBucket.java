package com.klu.security.ratelimit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "auth_rate_limit", indexes = @Index(name = "idx_auth_rate_limit_expiry", columnList = "expires_at"))
public class AuthRateLimitBucket {

    @Id
    @Column(name = "bucket_key", length = 64)
    private String key;

    @Column(name = "attempt_count", nullable = false)
    private int count;

    @Column(name = "expires_at", nullable = false)
    private long expiresAt;

    @Column(name = "next_allowed_at", nullable = false)
    private long nextAllowedAt;
}
