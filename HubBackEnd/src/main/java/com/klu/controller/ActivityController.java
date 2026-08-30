package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klu.dto.ActivityDto;
import com.klu.service.ActivityService;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    @Autowired
    ActivityService activityService;

    @GetMapping("/recent")
    public List<ActivityDto> recentActivities() {
        return activityService.getRecentActivities();
    }
    
}