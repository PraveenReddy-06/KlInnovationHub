package com.klu.service;
import java.util.List;

import com.klu.dto.ProjectLikeDto;
import com.klu.model.Project;

public interface ProjectLikesServic {

	ProjectLikeDto toggleLike(Long s,Integer p);
	
	List<Project> getTopProjects();
	List<Project> getTop3Projects();
	List<Project> getTop8Projects();
}
