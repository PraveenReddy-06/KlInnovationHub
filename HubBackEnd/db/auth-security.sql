-- One-time MySQL schema update for deployments with Hibernate automatic DDL disabled.
ALTER TABLE user_sign_up
    ADD COLUMN password_reset_code_hash VARCHAR(64) NULL,
    ADD COLUMN password_reset_code_expires_at DATETIME(6) NULL,
    ADD COLUMN password_reset_token_hash VARCHAR(64) NULL,
    ADD COLUMN password_reset_token_expires_at DATETIME(6) NULL,
    ADD COLUMN credential_version VARCHAR(36) NULL,
    ADD COLUMN last_admin_totp_step BIGINT NULL;

CREATE TABLE auth_rate_limit (
    bucket_key VARCHAR(64) NOT NULL PRIMARY KEY,
    attempt_count INT NOT NULL,
    expires_at BIGINT NOT NULL,
    next_allowed_at BIGINT NOT NULL,
    INDEX idx_auth_rate_limit_expiry (expires_at)
) ENGINE=InnoDB;
