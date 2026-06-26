package com.klu.service.implementation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.ActivityDto;
import com.klu.model.Activity;
import com.klu.model.Student;
import com.klu.repository.ActivityRepo;
import com.klu.service.ActivityService;

@Service
public class ActivityImple implements ActivityService {

    @Autowired
    ActivityRepo activityRepo;

    @Override
    public void createActivity(Student student, String activityType,String referenceName) {
        Activity activity = new Activity();
        activity.setStudent(student);
        activity.setActivityType(activityType);
        activity.setReferenceName(referenceName);
        activity.setCreatedAt(LocalDateTime.now());
        activityRepo.save(activity);
    }

    @Override
    public List<ActivityDto> getRecentActivities() {

        return activityRepo.findTop20ByOrderByCreatedAtDesc().stream()
                .map(a -> new ActivityDto(
                        a.getStudent().getStudentId(),
                        a.getStudent().getStudent_name(),
                        a.getStudent().getAvatarUrl(),
                        a.getActivityType(),
                        a.getReferenceName(),
                        a.getCreatedAt()
                )).collect(Collectors.toList());
    }
}