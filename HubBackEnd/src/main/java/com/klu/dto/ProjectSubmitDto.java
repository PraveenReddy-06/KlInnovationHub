package com.klu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectSubmitDto {
    private String projectName;
    private String description;
    @Pattern(regexp = "^(https://)?(www\\.)?github\\.com/.*$", message = "Must be a valid GitHub URL")
    private String githubUrl;
    private String liveUrl;
    private String choice;
    private String tech1;
    private String tech2;
    private String tech3;
}
