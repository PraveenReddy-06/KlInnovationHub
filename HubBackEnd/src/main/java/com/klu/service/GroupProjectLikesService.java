package com.klu.service;

import java.util.List;

import com.klu.model.GroupProject;

public interface GroupProjectLikesService {

 String toggleLike(Long studentId,Integer groupProjectId);
 List<GroupProject> getTopGroupProjects();
 
}