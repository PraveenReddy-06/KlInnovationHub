package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.GroupProject;
import com.klu.service.implementation.GroupProjectImple;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/groupproject")
public class GroupProjectController {

    @Autowired
    GroupProjectImple groupProjectService;

    @PostMapping("/submit/{teamLeadId}")
    public String submitGroupProject(@Valid @RequestBody GroupProject p,@PathVariable Long teamLeadId) {
        return groupProjectService.SubmitGroupProject(p,teamLeadId);
    }
    @GetMapping("/latest")
    public List<GroupProject> getLatestGroupSubmissions() {
        return groupProjectService.getLatestGroupSubmissions();
    }
    @GetMapping("/all")
    public List<GroupProject> getAllProjects() {
        return groupProjectService.getAllProjects();
    }
    @GetMapping("/year/{year}")
    public List<GroupProject> getProjectsByYear(@PathVariable Integer year) {
        return groupProjectService.getProjectsByYear(year);
    }
    @GetMapping("/branch/{branch}")
    public List<GroupProject> getProjectsByBranch(@PathVariable String branch) {
        return groupProjectService.getProjectsByBranch(branch);
    }
    @GetMapping("/branch/{branch}/year/{year}")
    public List<GroupProject> getProjectsByBranchAndYear(@PathVariable String branch,
                                                         @PathVariable Integer year) {
        return groupProjectService.getProjectsByBranchAndYear(branch, year);
    }
    @GetMapping("/student/{id}")
    public List<GroupProject> getProjectsById(@PathVariable long id) {
        return groupProjectService.getProjectsByid(id);
    }
}