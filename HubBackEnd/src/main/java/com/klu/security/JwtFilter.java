package com.klu.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")
                || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            var claims = jwtService.readToken(authHeader.substring(7));
            var account = userDetailsService.loadUserByUsername(claims.getSubject());
            if (!jwtService.allows(claims, account)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            var auth = new UsernamePasswordAuthenticationToken(account, null, account.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (JwtException | IllegalArgumentException | UsernameNotFoundException invalidToken) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/mail/") || path.startsWith("/dashboard/")
                || path.equals("/reviewer/generateOtp")
                || path.equals("/reviewer/verifyOtp")
                || path.equals("/reviewer/login")
                || path.equals("/admin/login")
                || path.equals("/reviewer/forgotPassword")
                || path.equals("/reviewer/verifyResetOtp")
                || path.equals("/reviewer/resetPassword")
                || path.equals("/reviewer/review/top-three");
    }
}
