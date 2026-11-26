package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.AdminLoginResponseDto;
import com.klu.dto.AdminLoginRequest;
import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.service.implementation.AdminLoginService;

@RestController
@RequestMapping("/admin")
public class AdminAuthController {

    @Autowired
    private AdminLoginService adminLoginService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponseDto> login(@RequestBody AdminLoginRequest request) {
        AdminLoginResponseDto result = adminLoginService.login(request);
        if (AuthRateLimiter.LOGIN_LIMIT_MESSAGE.equals(result.getMessage())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(result);
        }
        return ResponseEntity.ok(result);
    }
    
}
