package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ResetOtpResponse;
import com.klu.dto.ResetPasswordDto;
import com.klu.dto.VerifyResetOtpDto;
import com.klu.security.PasswordRecoveryService;
import com.klu.security.PasswordRecoveryService.AccountType;


@RestController
@RequestMapping("/reviewer")
public class ReviewerPasswordController {

    @Autowired
    private PasswordRecoveryService recovery;

    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestParam String mail) {
        String response = recovery.requestCode(AccountType.REVIEWER, mail);
        if (response.startsWith("Too many password reset requests")) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verifyResetOtp")
    public ResponseEntity<ResetOtpResponse> verifyResetOtp(@RequestBody VerifyResetOtpDto request) {
        ResetOtpResponse response = recovery.verifyCode(AccountType.REVIEWER, request);
        if (response.message().startsWith("Too many")) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resetPassword")
    public String resetPassword(@RequestBody ResetPasswordDto request) {
        return recovery.resetPassword(AccountType.REVIEWER, request);
    }
}
