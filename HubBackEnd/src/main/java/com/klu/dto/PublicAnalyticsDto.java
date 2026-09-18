package com.klu.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicAnalyticsDto {

    private long totalStudents;

    private long totalProjects;
    private long soloProjects;
    private long groupProjects;

    private long approvedProjects;
    private long activeReviewers;

    private long totalProjectLikes;

    private Map<String, Long> projectsByDomain;
}
