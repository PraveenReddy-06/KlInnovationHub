package com.klu.service;
import java.util.List;

import com.klu.model.Project;

public interface ProjectLikesServic {

	String toggleLike(Long s,Integer p);
	
	List<Project> getTopProjects();
	
	
	
}
