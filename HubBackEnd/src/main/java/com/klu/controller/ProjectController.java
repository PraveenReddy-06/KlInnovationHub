package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.ProjectSubmitDto;
import com.klu.model.Project;
import com.klu.service.CurrentUserService;
import com.klu.service.implementation.ProjectImple;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/project")
public class ProjectController {
	
	@Autowired
	ProjectImple projectService;
	
	@Autowired
	CurrentUserService currentUser;
	
    @PostMapping("/submit")
    public String submitProject(@Valid @RequestBody ProjectSubmitDto request) {
        long id = currentUser.getCurrentStudent().getStudentId();
        Project p = new Project();
        p.setProjectName(request.getProjectName());
        p.setDescription(request.getDescription());
        p.setGithubUrl(request.getGithubUrl());
        p.setLiveUrl(request.getLiveUrl());
        p.setChoice(request.getChoice());
        p.setTech1(request.getTech1());
        p.setTech2(request.getTech2());
        p.setTech3(request.getTech3());
        return projectService.SubmitProject(p, id);
    }
    @GetMapping("/latest")
    public List<Project> getLatestSubmissions() {
        return projectService.getLatestSubmissions();
    }
    @GetMapping("/all")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
    @GetMapping("/year/{year}")
    public List<Project> getProjectsByYear(@PathVariable Integer year) {
        return projectService.getProjectsByYear(year);
    }
    @GetMapping("/branch/{bname}")
    public List<Project> getProjectsByBranch(@PathVariable String bname) {
        return projectService.getProjectsByBranch(bname);
    }
    
    @GetMapping("/branch/{branch}/year/{year}")
    public List<Project> getProjectsByBranchAndYear(@PathVariable String branch,@PathVariable Integer year) {
    	return projectService.getProjectsByBranchAndYear(branch, year);
	}
    
    @GetMapping("/student/{id}")
    public List<Project> getProjectsByStudentId(@PathVariable long id) {
        return projectService.getProjectsByid(id);
    }
    
    @DeleteMapping("/deleteProject/{projectId}")
    public String deleteProject(@PathVariable int projectId) {
    	return projectService.deleteProjectsById(projectId);
    }
    
    @GetMapping("/my-pending")
    public List<Project> getMyPendingProjects() {
        return projectService.getMyPendingProjects();
    }
}
	

