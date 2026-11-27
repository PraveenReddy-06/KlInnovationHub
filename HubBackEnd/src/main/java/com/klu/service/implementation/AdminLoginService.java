package com.klu.service.implementation;

import java.nio.charset.StandardCharsets;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.dto.AdminLoginRequest;
import com.klu.dto.AdminLoginResponseDto;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.security.AdminTotp;
import com.klu.security.JwtService;
import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.security.ratelimit.AuthRateLimiter.Action;

@Service
public class AdminLoginService {

    private static final String INVALID_CREDENTIALS = "Invalid admin credentials or authenticator code.";

    private final AuthenticationManager authenticationManager;
    private final UserSignUpRepository users;
    private final JwtService jwtService;
    private final AdminTotp totp;
    private final AuthRateLimiter limiter;

    public AdminLoginService(AuthenticationManager authenticationManager, UserSignUpRepository users,
            JwtService jwtService, AdminTotp totp, AuthRateLimiter limiter) {
        this.authenticationManager = authenticationManager;
        this.users = users;
        this.jwtService = jwtService;
        this.totp = totp;
        this.limiter = limiter;
    }

    @Transactional
    public AdminLoginResponseDto login(AdminLoginRequest request) {
        if (request.mail() == null || request.mail().isBlank() || request.mail().length() > 254
                || request.password() == null || request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            return failure(INVALID_CREDENTIALS);
        }
        UserSignUp user = users.findByMailForUpdate(request.mail().strip()).orElse(null);
        if (user == null || !user.isVerified() || !"ROLE_ADMIN".equals(user.getRole())) {
            return failure(INVALID_CREDENTIALS);
        }
        if (!limiter.acquire(Action.LOGIN, user.getMail())) {
            return failure(AuthRateLimiter.LOGIN_LIMIT_MESSAGE);
        }

        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getMail(), request.password()));
            var step = totp.verify(user.getMail(), request.authenticatorCode(), user.getLastAdminTotpStep());
            if (step.isEmpty()) {
                return failure(INVALID_CREDENTIALS);
            }

            user.setLastAdminTotpStep(step.getAsLong());
            limiter.clearLogin(user.getMail());
            return new AdminLoginResponseDto("Welcome To Admin Dashboard", user.getName(), user.getMail(),
                    jwtService.generateAdminToken(authentication));
        } catch (BadCredentialsException invalidPassword) {
            return failure(INVALID_CREDENTIALS);
        }
    }

    private AdminLoginResponseDto failure(String message) {
        return new AdminLoginResponseDto(message, null, null, null);
    }
}
