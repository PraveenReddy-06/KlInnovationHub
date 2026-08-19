package com.klu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewerProjectDTO {

    private Integer projectId;

    private String projectName;
    private String description;

    private String githubUrl;
    private String liveUrl;

    private String choice;

    private String tech1;
    private String tech2;
    private String tech3;

    private String status;

    private String projectType;

    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Integer year;
    private String branch;
}