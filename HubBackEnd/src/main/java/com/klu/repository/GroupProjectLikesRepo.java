package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klu.model.GroupProject;
import com.klu.model.GroupProjectLikes;
import com.klu.model.Project;

@Repository
public interface GroupProjectLikesRepo extends JpaRepository<GroupProjectLikes,Integer>{

	 boolean existsByStudent_StudentIdAndGroupProject_GroupProjectId(Long studentId, Integer groupProjectId);
	
	 void deleteByStudent_StudentIdAndGroupProject_GroupProjectId(Long studentId, Integer groupProjectId);
	
	 @Query(value = "SELECT gp.* FROM group_project_likes gpl " +
             "JOIN group_project gp ON gpl.project_id = gp.group_project_id " +
             "GROUP BY gpl.project_id " +
             "ORDER BY COUNT(gpl.student_id) DESC " +
             "LIMIT 5", nativeQuery = true)
	 List<GroupProject> getTopGroupProjects();

	 int countByGroupProject_GroupProjectId(Integer groupProjectId);

	 @Query(value = "SELECT gp.* FROM group_project_likes gpl " +
             "JOIN group_project gp ON gpl.project_id = gp.group_project_id " +
             "GROUP BY gpl.project_id " +
             "ORDER BY COUNT(gpl.student_id) DESC " +
             "LIMIT 8", nativeQuery = true)
	 List<GroupProject> getTop8Projects();
	 
	 @Query(value = """
			 SELECT gp.*
			 FROM group_project gp
			 LEFT JOIN group_project_likes gpl
			 ON gp.group_project_id = gpl.project_id
			 GROUP BY gp.group_project_id
			 ORDER BY COUNT(gpl.student_id) DESC
			 """, nativeQuery = true)
	List<GroupProject> getAllProjectsByLikes();
}