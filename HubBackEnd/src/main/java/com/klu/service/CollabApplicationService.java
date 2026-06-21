package com.klu.service;

import java.util.List;

import com.klu.model.CollabApplication;

public interface CollabApplicationService {

	String createCollabApplication(Integer collaborationId);
	List<CollabApplication> getAllCollabApplications();
	List<CollabApplication> getMyApplications(Long studentid);
	String updateApplicationStatus(Integer applicationId, String status);
}
