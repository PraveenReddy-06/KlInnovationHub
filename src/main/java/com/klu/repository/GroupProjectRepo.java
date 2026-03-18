package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.GroupProject;

@Repository
public interface GroupProjectRepo extends JpaRepository<GroupProject,Integer>{

	List<GroupProject> findTop5ByOrderByGroupProjectIdDesc();

	List<GroupProject> findByTeamLead_Year(Integer year);

	List<GroupProject> findByTeamLead_Branch(String branch);

	List<GroupProject> findByTeamLead_BranchAndTeamLead_Year(String branch, Integer year);

	List<GroupProject> findByTeamLead_StudentId(Long id);

}
