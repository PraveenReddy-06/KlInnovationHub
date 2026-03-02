package com.klu.service;

import java.util.List;

import com.klu.model.GroupProject;

public interface GroupProjectService {
	
	String SubmitGroupProject(GroupProject p);
	List<GroupProject> getLatestGroupSubmissions();
	
	List<GroupProject> getAllProjects();
	List<GroupProject> getProjectsByYear(int year);
	List<GroupProject> getProjectsByBranch(String branch);
	List<GroupProject> getProjectsByBranchAndYear(String branch,int year);
	List<GroupProject> getProjectsByid(long id);
}
