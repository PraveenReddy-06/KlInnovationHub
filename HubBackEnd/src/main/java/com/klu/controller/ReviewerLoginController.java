package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ReviewerLoginResponseDto;
import com.klu.mail.Login;
import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.service.implementation.ReviewerLoginService;

@RestController
@RequestMapping("/reviewer")
public class ReviewerLoginController {

    @Autowired
    private ReviewerLoginService reviewerLoginService;

    @PostMapping("/login")
    public ResponseEntity<ReviewerLoginResponseDto> login(@RequestBody Login request) {
        ReviewerLoginResponseDto result = reviewerLoginService.login(request);
        if (AuthRateLimiter.LOGIN_LIMIT_MESSAGE.equals(result.getMessage())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(result);
        }
        return ResponseEntity.ok(result);
    }
}
