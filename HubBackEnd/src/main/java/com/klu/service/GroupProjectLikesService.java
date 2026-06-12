package com.klu.service;

import java.util.List;

import com.klu.dto.GroupProjectLikeDto;
import com.klu.model.GroupProject;
import com.klu.model.Project;

public interface GroupProjectLikesService {

	GroupProjectLikeDto toggleLike(Long studentId,Integer groupProjectId);
	List<GroupProject> getTopGroupProjects();
	List<GroupProject> getTop8Projects();
 
}