package com.klu.service;

import java.util.List;

import com.klu.model.CollabApplication;

public interface CollabApplicationService {

	String createCollabApplication(CollabApplication app);
	List<CollabApplication> getAllCollabApplications();
	List<CollabApplication> getMyApplications(Long studentid);
}
