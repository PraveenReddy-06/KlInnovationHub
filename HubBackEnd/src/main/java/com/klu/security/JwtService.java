package com.klu.security;

import java.util.Date;
import java.util.Objects;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String CREDENTIAL_VERSION = "cv";
    private static final String ADMIN_MFA = "admin_mfa";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms:3600000}")
    private long expirationMs;

    private SecretKey key;

    @jakarta.annotation.PostConstruct
    private void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        return issue(authentication, false);
    }

    // Called only after the admin authenticator code has been consumed.
    public String generateAdminToken(Authentication authentication) {
        return issue(authentication, true);
    }

    private String issue(Authentication authentication, boolean adminMfa) {
        AccountPrincipal account = (AccountPrincipal) authentication.getPrincipal();
        Date issuedAt = new Date();
        return Jwts.builder().subject(account.getUsername()).issuedAt(issuedAt)
                .expiration(new Date(issuedAt.getTime() + expirationMs))
                .claim(CREDENTIAL_VERSION, account.credentialVersion())
                .claim(ADMIN_MFA, adminMfa ? Boolean.TRUE : null)
                .signWith(key)
                .compact();
    }

    Claims readToken(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    boolean allows(Claims claims, UserDetails details) {
        if (!(details instanceof AccountPrincipal account) || !account.isEnabled()
                || !account.getUsername().equals(claims.getSubject())
                || !Objects.equals(account.credentialVersion(), claims.get(CREDENTIAL_VERSION, String.class))) {
            return false;
        }
        boolean admin = account.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        return !admin || Boolean.TRUE.equals(claims.get(ADMIN_MFA, Boolean.class));
    }
}
