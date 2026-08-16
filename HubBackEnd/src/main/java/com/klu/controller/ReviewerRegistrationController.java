package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ReviewerSignupDto;
import com.klu.dto.ReviewerVerifyOtpDto;
import com.klu.service.implementation.ReviewerRegistrationService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reviewer")
public class ReviewerRegistrationController {

    @Autowired
    private ReviewerRegistrationService reviewerRegistrationService;

    @PostMapping("/generateOtp")
    public String generateOtp(@RequestBody ReviewerSignupDto request) {
        return reviewerRegistrationService.generateOtp(request);
    }

    @PostMapping("/verifyOtp")
    public String verifyOtp(@RequestBody ReviewerVerifyOtpDto request) {
        return reviewerRegistrationService.verifyOtp(request);
    }
}
