package com.klu.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	

	private static final String secret="SECRETKEYFORKLINNOVATIONHUBIS:REDDY@12345PRAVEEN@069963656797";
    private final SecretKey key =Keys.hmacShaKeyFor(secret.getBytes());
     
	public String generateToken(String email) {

        return Jwts.builder().subject(email).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+ 1000 * 60 * 60))
                .signWith(key)
                .compact();
    }
	
	public Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid( String token,UserDetails userDetails) {
        String username =extractUsername(token);
        return username.equals(userDetails.getUsername())&&!isTokenExpired(token);
    }
}
	
