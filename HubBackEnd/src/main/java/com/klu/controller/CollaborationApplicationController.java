package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.CollabApplication;
import com.klu.service.implementation.CollabApplicationImple;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/collabapplication")
public class CollaborationApplicationController {

    @Autowired
    CollabApplicationImple collabApplicationService;

    @PostMapping("/apply")
    public String createCollabApplication(@RequestBody CollabApplication app) {
        return collabApplicationService.createCollabApplication(app);
    }
    @GetMapping("/all")
    public List<CollabApplication> getAllCollabApplications() {
        return collabApplicationService.getAllCollabApplications();
    }
    
    @GetMapping("/student/{id}")
    public List<CollabApplication> getMyApplications(@PathVariable Long id){

        return collabApplicationService.getMyApplications(id);
    }
    
    @PatchMapping("/updateStatus/{id}")
    public String updateApplicationStatus(@PathVariable Integer id,@RequestParam String status) {
        return collabApplicationService.updateApplicationStatus(id, status);
    }
    
}