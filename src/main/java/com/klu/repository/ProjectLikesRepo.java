package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.Project;
import com.klu.model.ProjectLikes;

@Repository
public interface ProjectLikesRepo extends JpaRepository<ProjectLikes,Integer>{

	List<Project> findTop5ByOrderByLikesDesc();

}
