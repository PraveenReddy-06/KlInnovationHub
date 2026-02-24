package com.klu.service;

import java.util.List;

import com.klu.model.GroupProject;

public interface GroupProjectService {
	
	String SubmitGroupProject(GroupProject p);
	List<GroupProject> getLatestGroupSubmissions();
	
	List<GroupProject> getAllProjects();
	List<GroupProject> getProjectsByYear();
	List<GroupProject> getProjectsByBranch();
	List<GroupProject> getProjectsByid(int id);
}
