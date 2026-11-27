package com.klu.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GroupProjectSubmitDto {

    private String project_name;
    private String description;
    @Pattern(regexp = "^(https://)?(www\\.)?github\\.com/.*$", message = "Must be a valid GitHub URL")
    private String githubUrl;
    private String liveUrl;

    private String choice;
    private String tech1;
    private String tech2;
    private String tech3;

    private List<@NotNull @Valid Member> studentList;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Member(@NotNull Long studentId) {}
}