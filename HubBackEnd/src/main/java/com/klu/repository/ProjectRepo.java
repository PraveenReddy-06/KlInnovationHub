package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.klu.model.Project;
import com.klu.model.ProjectStatus;

@Repository
public interface ProjectRepo extends JpaRepository<Project,Integer>{

	List<Project> findByStudentYear(int year);

	List<Project> findByStudentBranch(String bname);

	List<Project> findByStudentStudentId(long id);

	List<Project> findTop5ByOrderByProjectIdDesc();

	List<Project> findByStudentBranchAndStudentYear(String branch, Integer year);

	List<Project> findByStatus(ProjectStatus status);

	List<Project> findTop5ByStatusOrderByProjectIdDesc(ProjectStatus status);

	List<Project> findByStatusAndStudentYear(ProjectStatus status, int year);

	List<Project> findByStatusAndStudentBranch(ProjectStatus status, String bname);

	List<Project> findByStatusAndStudentBranchAndStudentYear(ProjectStatus status, String branch, Integer year);

	@Modifying
	@Query("update Project p set p.status = :newStatus where p.projectId = :projectId and p.status = :expectedStatus")
	int updateStatusIfPending(@Param("projectId") Integer projectId,
			@Param("newStatus") ProjectStatus newStatus,
			@Param("expectedStatus") ProjectStatus expectedStatus);
	
}
