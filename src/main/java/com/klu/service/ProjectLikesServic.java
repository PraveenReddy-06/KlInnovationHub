package com.klu.service;

import java.util.List;

import com.klu.model.GroupProject;
import com.klu.model.Project;

public interface ProjectLikesServic {

	List<Project> getTopProjects();
	List<GroupProject> getTopGroupProjects();
	
}
