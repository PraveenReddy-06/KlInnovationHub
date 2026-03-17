package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.Collaboration;
import com.klu.service.implementation.CollaborationImple;

@RestController
@RequestMapping("/collaboration")
public class CollaborationController {

    @Autowired
    CollaborationImple collaborationService;

    @PostMapping("/create/{studentId}")
    public String createTeam(@RequestBody Collaboration collab,@PathVariable Long studentId) {
    	collaborationService.CreateTeam(collab,studentId);
        return "Collboration Posted Sucessfully";
    }
    @GetMapping("/all")
    public List<Collaboration> getAllCollaboration() {
        return collaborationService.getAllCollaboration();
    }
}