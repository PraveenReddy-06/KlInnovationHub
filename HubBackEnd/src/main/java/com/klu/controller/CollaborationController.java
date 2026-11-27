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

import com.klu.dto.CollaborationDto;
import com.klu.model.Collaboration;
import com.klu.service.CurrentUserService;
import com.klu.service.implementation.CollaborationImple;

@RestController
@RequestMapping("/collaboration")
public class CollaborationController {

    @Autowired
    CollaborationImple collaborationService;
    
    @Autowired
    CurrentUserService currentUser;

    @PostMapping("/create")
    public String createTeam(@RequestBody CollaborationDto request) {
        long studentId = currentUser.getCurrentStudent().getStudentId();
        Collaboration collab = new Collaboration();
        collab.setName(request.getName());
        collab.setProblemStatement(request.getProblemStatement());
        collab.setDescription(request.getDescription());
        collab.setTeamSize(request.getTeamSize());
        collab.setSkill1(request.getSkill1());
        collab.setSkill2(request.getSkill2());
        collab.setSkill3(request.getSkill3());
        collab.setLinkedIn(request.getLinkedIn());
        collab.setStatus(request.getStatus());
        collaborationService.CreateTeam(collab, studentId);
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
    
    @GetMapping("/following")
    public List<Collaboration> getFollowingCollaborations() {
        return collaborationService.getFollowingCollaborations();
    }
}