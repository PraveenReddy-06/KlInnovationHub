package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.AdminLoginResponseDto;
import com.klu.mail.Login;
import com.klu.service.implementation.AdminLoginService;

@RestController
@RequestMapping("/admin")
public class AdminAuthController {

    @Autowired
    private AdminLoginService adminLoginService;

    @PostMapping("/login")
    public AdminLoginResponseDto login(@RequestBody Login request) {
        return adminLoginService.login(request);
    }
}
