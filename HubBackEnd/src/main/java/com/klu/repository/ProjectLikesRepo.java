package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klu.model.Project;
import com.klu.model.ProjectLikes;

@Repository
public interface ProjectLikesRepo extends JpaRepository<ProjectLikes, Integer> {

    boolean existsByStudent_StudentIdAndProject_ProjectId(Long studentId, Integer projectId);

    void deleteByStudent_StudentIdAndProject_ProjectId(Long studentId, Integer projectId);

    long countByProject_ProjectId(Integer projectId);

    @Query(value = "SELECT p.* FROM project p " +
            "LEFT JOIN project_likes pl ON p.project_id = pl.project_id " +
            "GROUP BY p.project_id " +
            "ORDER BY COUNT(pl.student_id) DESC " +
            "LIMIT 5", nativeQuery = true)
    List<Project> getTopProjects();

    @Query(value = "SELECT p.* FROM project p " +
            "LEFT JOIN project_likes pl ON p.project_id = pl.project_id " +
            "GROUP BY p.project_id " +
            "ORDER BY COUNT(pl.student_id) DESC " +
            "LIMIT 3", nativeQuery = true)
	List<Project> getTop3Projects();
}
