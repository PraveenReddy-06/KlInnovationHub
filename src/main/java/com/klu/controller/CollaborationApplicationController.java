package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.CollabApplication;
import com.klu.service.implementation.CollabApplicationImple;

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
}