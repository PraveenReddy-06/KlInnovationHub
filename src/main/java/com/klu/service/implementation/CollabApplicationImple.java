package com.klu.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;

import com.klu.model.CollabApplication;
import com.klu.repository.CollabApplicationRepo;
import com.klu.service.CollabApplicationService;

public class CollabApplicationImple implements CollabApplicationService {

	@Autowired
	CollabApplicationRepo collabApplicationRepo;
	
	@Override
	public String createCollabApplication(CollabApplication app) {
		
		
		return null;
	}


}
