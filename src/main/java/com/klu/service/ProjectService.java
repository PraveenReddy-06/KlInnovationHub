package com.klu.service;

import java.util.List;

import com.klu.model.Project;

public interface ProjectService {

	String SubmitProject(Project p);
	List<Project> getLatestSubmissions();
	
	List<Project> getAllProjects();
	List<Project> getProjectsByYear(int year);
	List<Project> getProjectsByBranch(String bname);
	List<Project> getProjectsByid(long id);
	
	
}
