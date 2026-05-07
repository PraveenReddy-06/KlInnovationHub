package com.klu.service;

import java.util.List;

import com.klu.dto.GroupProjectLikeDto;
import com.klu.model.GroupProject;

public interface GroupProjectLikesService {

 GroupProjectLikeDto toggleLike(Long studentId,Integer groupProjectId);
 List<GroupProject> getTopGroupProjects();
 
}