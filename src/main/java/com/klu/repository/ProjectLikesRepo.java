package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klu.model.Project;
import com.klu.model.ProjectLikes;

@Repository
public interface ProjectLikesRepo extends JpaRepository<ProjectLikes,Integer>{


	boolean existsByStudent_StudentIdAndProject_ProjectId(Long studentId, Integer projectId);

	void deleteByStudent_StudentIdAndProject_ProjectId(Long studentId, Integer projectId);

	@Query(value = "SELECT p.* FROM project_likes pl " +
            "JOIN project p ON pl.project_id = p.project_id " +
            "GROUP BY pl.project_id " +
            "ORDER BY COUNT(pl.student_id) DESC " +
            "LIMIT 5", nativeQuery = true)
	List<Project> getTopProjects();

}
