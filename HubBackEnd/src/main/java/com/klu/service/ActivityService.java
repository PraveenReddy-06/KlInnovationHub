package com.klu.service;

import java.util.List;

import com.klu.dto.ActivityDto;
import com.klu.model.Student;

public interface ActivityService {

    void createActivity(Student student,String activityType,String referenceName);
    List<ActivityDto> getRecentActivities();
}