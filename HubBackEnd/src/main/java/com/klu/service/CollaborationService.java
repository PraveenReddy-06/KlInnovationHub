package com.klu.service;

import java.util.List;

import com.klu.model.Collaboration;

public interface CollaborationService {

	String CreateTeam(Collaboration collab,Long id);
	List<Collaboration> getAllCollaboration();
	List<Collaboration> getMyTeams(Long studentId);
	void deleteTeam(Integer collaborationId);
}
