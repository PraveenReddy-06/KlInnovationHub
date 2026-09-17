package com.klu.dto;

import java.util.List;

import com.klu.model.GroupProject;
import com.klu.model.Project;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowingProjectsDto {

    private List<Project> projects;
    private List<GroupProject> groupProjects;
}
