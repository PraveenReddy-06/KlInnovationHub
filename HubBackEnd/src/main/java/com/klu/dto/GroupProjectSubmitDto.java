package com.klu.dto;

import java.util.List;

import lombok.Data;

@Data
public class GroupProjectSubmitDto {

    private String project_name;
    private String description;
    private String githubUrl;
    private String liveUrl;

    private String choice;
    private String tech1;
    private String tech2;
    private String tech3;

    private Integer teamLeadId;

    private List<Integer> studentIds;
}