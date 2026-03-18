package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.GroupProject;
import com.klu.service.implementation.GroupProjectLikesImple;

@RestController
@RequestMapping("/grouplikes")
public class GroupProjectLikesController {

    @Autowired
    GroupProjectLikesImple groupProjectLikesService;

    @GetMapping("/top")
    public List<GroupProject> getTopGroupProjects() {
        return groupProjectLikesService.getTopGroupProjects();
    }
    
    @PostMapping("/toggleLike/{studentId}/{projectId}")
    public	String toggleLike(@PathVariable Long studentId,@PathVariable Integer projectId)	{
    	return groupProjectLikesService.toggleLike(studentId, projectId);
    	
    }
    
}