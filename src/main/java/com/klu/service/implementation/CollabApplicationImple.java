package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.CollabApplication;
import com.klu.repository.CollabApplicationRepo;
import com.klu.service.CollabApplicationService;

@Service
public class CollabApplicationImple implements CollabApplicationService {

	@Autowired
	CollabApplicationRepo collabApplicationRepo;
	
	@Override
	public String createCollabApplication(CollabApplication app) {
		collabApplicationRepo.save(app);
		return "Created Collabortion Application";
	}

	@Override
	public List<CollabApplication> getAllCollabApplications() {
		return collabApplicationRepo.findAll();
	}
}
