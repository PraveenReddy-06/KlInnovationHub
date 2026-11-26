package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ReviewerSignupDto;
import com.klu.dto.ReviewerVerifyOtpDto;
import com.klu.service.implementation.ReviewerRegistrationService;

@RestController
@RequestMapping("/reviewer")
public class ReviewerRegistrationController {

    @Autowired
    private ReviewerRegistrationService reviewerRegistrationService;

    @PostMapping("/generateOtp")
    public ResponseEntity<String> generateOtp(@RequestBody ReviewerSignupDto request) {
        return otpResponse(reviewerRegistrationService.generateOtp(request));
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<String> verifyOtp(@RequestBody ReviewerVerifyOtpDto request) {
        return otpResponse(reviewerRegistrationService.verifyOtp(request));
    }
    private ResponseEntity<String> otpResponse(String message) {
        if (message.startsWith("Too many")) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(message);
        }
        return ResponseEntity.ok(message);
    }
}
