package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.Project;
import com.klu.service.implementation.ProjectLikesImple;

@RestController
@RequestMapping("/likes")
public class ProjectLikesController {

    @Autowired
    ProjectLikesImple projectLikesService;

    @GetMapping("/top")
    public List<Project> getTopProjects() {
        return projectLikesService.getTopProjects();
    }
    
    @PostMapping("/toggleLike/{studentId}/{projectId}")
    public	String toggleLike(@PathVariable Long studentId,@PathVariable Integer projectId)	{
    	return projectLikesService.toggleLike(studentId, projectId);    	
    }
    
}