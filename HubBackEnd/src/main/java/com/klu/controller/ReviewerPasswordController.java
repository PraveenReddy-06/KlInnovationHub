package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ResetPasswordDto;
import com.klu.dto.VerifyResetOtpDto;
import com.klu.service.implementation.ReviewerPasswordService;


@RestController
@RequestMapping("/reviewer")
public class ReviewerPasswordController {

    @Autowired
    private ReviewerPasswordService reviewerPasswordService;

    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestParam String mail) {
        String response = reviewerPasswordService.forgotPassword(mail);
        if (response.startsWith("Too many password reset requests")) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verifyResetOtp")
    public ResponseEntity<String> verifyResetOtp(@RequestBody VerifyResetOtpDto request) {
        String response = reviewerPasswordService.verifyResetOtp(request);
        if (response.startsWith("Too many invalid OTP attempts")) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resetPassword")
    public String resetPassword(@RequestBody ResetPasswordDto request) {
        return reviewerPasswordService.resetPassword(request);
    }
}
