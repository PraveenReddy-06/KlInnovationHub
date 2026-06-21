package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.GroupProjectLikeDto;
import com.klu.model.GroupProject;
import com.klu.model.Project;
import com.klu.service.CurrentUserService;
import com.klu.service.implementation.GroupProjectLikesImple;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/grouplikes")
public class GroupProjectLikesController {

    @Autowired
    GroupProjectLikesImple groupProjectLikesService;
    
    @Autowired
    CurrentUserService currentUser;

    @GetMapping("/top")
    public List<GroupProject> getTopGroupProjects() {
        return groupProjectLikesService.getTopGroupProjects();
    }
    
    @GetMapping("/top8")
    public List<GroupProject> getTop8Projects() {
        return groupProjectLikesService.getTop8Projects();
    }
    
    @PostMapping("/toggleLike/{projectId}")
    public	GroupProjectLikeDto toggleLike(@PathVariable Integer projectId)	{
    	long studentId = currentUser.getCurrentStudent().getStudentId();
    	return groupProjectLikesService.toggleLike(studentId, projectId);
    	
    }
    
}