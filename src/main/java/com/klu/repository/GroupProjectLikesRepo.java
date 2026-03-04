package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.GroupProject;
import com.klu.model.ProjectLikes;

public interface GroupProjectLikesRepo extends JpaRepository<ProjectLikes,Integer>{

 List<GroupProject> findTop5ByOrderByLikesDesc();
 
 
 
}