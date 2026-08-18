package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.GroupProject;
import com.klu.model.Project;
import com.klu.service.implementation.GroupProjectImple;
import com.klu.service.implementation.ProjectImple;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reviewer")
public class ReviewerProjectController {

    @Autowired
    private ProjectImple projectService;

    @Autowired
    private GroupProjectImple groupProjectService;

    @GetMapping("/projects/pending")
    public List<Project> getPendingProjects() {
        return projectService.getPendingProjects();
    }

    @GetMapping("/groupProjects/pending")
    public List<GroupProject> getPendingGroupProjects() {
        return groupProjectService.getPendingGroupProjects();
    }
}
