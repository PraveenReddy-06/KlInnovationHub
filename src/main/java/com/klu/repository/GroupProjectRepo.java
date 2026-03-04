package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klu.model.GroupProject;

@Repository
public interface GroupProjectRepo extends JpaRepository<GroupProject,Integer>{

	List<GroupProject> findTop5ByOrderByGroupProjectIdDesc();

	@Query("SELECT DISTINCT g FROM GroupProject g JOIN g.studentList s WHERE s.year = ?1")
	List<GroupProject> getProjectsByYear(int year);

	@Query("SELECT DISTINCT g FROM GroupProject g JOIN g.studentList s WHERE s.branch = ?1")
	List<GroupProject> getProjectsByBranch(String branch);

	@Query("SELECT DISTINCT g FROM GroupProject g JOIN g.studentList s WHERE s.branch = ?1 and s.year=?2")
	List<GroupProject> getProjectsByBranchAndYear(String branch, int year);

	@Query("SELECT s.groupProject FROM Student s WHERE s.student_id = ?1")
	List<GroupProject> getProjectsByid(long id);

}
