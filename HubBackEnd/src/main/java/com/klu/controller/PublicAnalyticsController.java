package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.PublicAnalyticsDto;
import com.klu.service.implementation.PublicAnalyticsService;

@RestController
@RequestMapping("/public/analytics")
public class PublicAnalyticsController {

    @Autowired
    private PublicAnalyticsService publicAnalyticsService;

    @GetMapping
    public PublicAnalyticsDto getAnalytics() {
        return publicAnalyticsService.getAnalytics();
    }
}
