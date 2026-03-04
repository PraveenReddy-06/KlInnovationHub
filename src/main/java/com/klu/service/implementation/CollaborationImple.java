package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Collaboration;
import com.klu.repository.CollaborationRepo;
import com.klu.service.CollaborationService;

@Service
public class CollaborationImple implements CollaborationService{

	@Autowired 
	CollaborationRepo collaborationRepo;
	
	@Override
	public String CreateTeam(Collaboration collab) {
		collaborationRepo.save(collab);
		return "Collaboration Posted Sucessfully";
	}

	@Override
	public List<Collaboration> getAllCollaboration() {
		return collaborationRepo.findAll();
	}
}
