package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.Project;

@Repository
public interface ProjectRepo extends JpaRepository<Project,Integer>{

	List<Project> findTop5ByOrderByProjectIdDesc();

	List<Project> findByStudentYear(int year);

	List<Project> findByStudentBranch(String bname);

	List<Project> findByStudentStudentId(long id);
	
}
