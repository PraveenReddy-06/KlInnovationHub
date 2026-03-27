package com.klu.service;

import java.util.List;

import com.klu.model.Collaboration;

public interface CollaborationService {

	String CreateTeam(Collaboration collab,Long id);
	List<Collaboration> getAllCollaboration();
}
