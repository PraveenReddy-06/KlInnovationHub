package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.GroupProject;
import com.klu.model.ProjectLikes;

@Repository
public interface GroupProjectLikesRepo extends JpaRepository<ProjectLikes,Integer>{

 List<GroupProject> findTop5ByOrderByLikesDesc();
}