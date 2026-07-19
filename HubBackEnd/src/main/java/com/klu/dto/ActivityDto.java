package com.klu.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ActivityDto {

    private Long studentId;
    private String studentName;
    private String avatarUrl;

    private String activityType;
    private String referenceName;

    private LocalDateTime createdAt;
}