package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ResetPasswordDto;
import com.klu.dto.VerifyResetOtpDto;
import com.klu.service.implementation.ReviewerPasswordService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reviewer")
public class ReviewerPasswordController {

    @Autowired
    private ReviewerPasswordService reviewerPasswordService;

    @PostMapping("/forgotPassword")
    public String forgotPassword(@RequestParam String mail) {
        return reviewerPasswordService.forgotPassword(mail);
    }

    @PostMapping("/verifyResetOtp")
    public String verifyResetOtp(@RequestBody VerifyResetOtpDto request) {
        return reviewerPasswordService.verifyResetOtp(request);
    }

    @PostMapping("/resetPassword")
    public String resetPassword(@RequestBody ResetPasswordDto request) {
        return reviewerPasswordService.resetPassword(request);
    }
}
