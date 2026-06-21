package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.Collaboration;
import com.klu.service.CurrentUserService;
import com.klu.service.implementation.CollaborationImple;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/collaboration")
public class CollaborationController {

    @Autowired
    CollaborationImple collaborationService;
    
    @Autowired
    CurrentUserService currentUser;

    @PostMapping("/create")
    public String createTeam(@RequestBody Collaboration collab) {
    	long studentId = currentUser.getCurrentStudent().getStudentId();
    	collaborationService.CreateTeam(collab,studentId);
        return "Collboration Posted Sucessfully";
    }
    @GetMapping("/all")
    public List<Collaboration> getAllCollaboration() {
        return collaborationService.getAllCollaboration();
    }
    
    @GetMapping("/student/{id}")
    public List<Collaboration> getMyTeams(
            @PathVariable Long id){

        return collaborationService.getMyTeams(id);
    }
    
    @DeleteMapping("/delete/{collaborationId}")
    public String deleteTeam( @PathVariable Integer collaborationId) {
        collaborationService.deleteTeam(collaborationId);
        return "Team Deleted Successfully";
    }
}