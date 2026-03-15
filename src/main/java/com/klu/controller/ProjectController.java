package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.Project;
import com.klu.service.implementation.ProjectImple;

@RestController
@RequestMapping("/project")
public class ProjectController {
	
	@Autowired
	ProjectImple projectService;
	@PostMapping("/submit")
    public String submitProject(@RequestBody Project p) {
        return projectService.SubmitProject(p);
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
    public List<Project> getProjectsByYear(@PathVariable int year) {
        return projectService.getProjectsByYear(year);
    }
    @GetMapping("/branch/{bname}")
    public List<Project> getProjectsByBranch(@PathVariable String bname) {
        return projectService.getProjectsByBranch(bname);
    }
    @GetMapping("/student/{id}")
    public List<Project> getProjectsByStudentId(@PathVariable long id) {
        return projectService.getProjectsByid(id);
    }
}
	

