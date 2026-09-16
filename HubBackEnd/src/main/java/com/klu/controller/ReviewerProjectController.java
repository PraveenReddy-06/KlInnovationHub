package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.GroupProject;
import com.klu.model.Project;
import com.klu.model.Reviewer;
import com.klu.service.CurrentReviewerService;
import com.klu.service.implementation.GroupProjectImple;
import com.klu.service.implementation.ProjectImple;

@RestController
@RequestMapping("/reviewer")
public class ReviewerProjectController {

    @Autowired private ProjectImple projectService;
    @Autowired private GroupProjectImple groupProjectService;
    @Autowired private CurrentReviewerService currentReviewerService;

    @GetMapping("/projects/pending")
    public List<Project> getPendingProjects() {
        return projectService.getPendingProjects();
    }

    @GetMapping("/groupProjects/pending")
    public List<GroupProject> getPendingGroupProjects() {
        return groupProjectService.getPendingGroupProjects();
    }

    @GetMapping("/projects/recommended")
    public List<Project> getRecommendedProjects() {
        Reviewer reviewer = currentReviewerService.getCurrentReviewer();
        return projectService.getRecommendedProjects(reviewer.getChoice1(), reviewer.getChoice2(), reviewer.getChoice3());
    }

    @GetMapping("/groupProjects/recommended")
    public List<GroupProject> getRecommendedGroupProjects() {
        Reviewer reviewer = currentReviewerService.getCurrentReviewer();
        return groupProjectService.getRecommendedGroupProjects(reviewer.getChoice1(), reviewer.getChoice2(), reviewer.getChoice3());
    }
}
