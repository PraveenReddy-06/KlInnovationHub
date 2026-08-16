package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ReviewerLoginResponseDto;
import com.klu.mail.Login;
import com.klu.service.implementation.ReviewerLoginService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reviewer")
public class ReviewerLoginController {

    @Autowired
    private ReviewerLoginService reviewerLoginService;

    @PostMapping("/login")
    public ReviewerLoginResponseDto login(@RequestBody Login request) {
        return reviewerLoginService.login(request);
    }
}
