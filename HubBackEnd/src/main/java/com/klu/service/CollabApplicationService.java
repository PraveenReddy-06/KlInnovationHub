package com.klu.service;

import java.util.List;

import com.klu.dto.CollabApplicationResponse;

public interface CollabApplicationService {

	String createCollabApplication(Integer collaborationId);
	List<CollabApplicationResponse> getIncomingApplications();
	List<CollabApplicationResponse> getMyApplications(Long studentId);
	String updateApplicationStatus(Integer applicationId, String status);
}
