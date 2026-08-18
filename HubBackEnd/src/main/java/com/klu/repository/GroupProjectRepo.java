package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.GroupProject;
import com.klu.model.ProjectStatus;

@Repository
public interface GroupProjectRepo extends JpaRepository<GroupProject,Integer>{

	List<GroupProject> findTop5ByOrderByGroupProjectIdDesc();

	List<GroupProject> findByTeamLead_Year(Integer year);

	List<GroupProject> findByTeamLead_Branch(String branch);

	List<GroupProject> findByTeamLead_BranchAndTeamLead_Year(String branch, Integer year);

	List<GroupProject> findByTeamLead_StudentId(Long id);

	List<GroupProject> findByStatus(ProjectStatus status);

	List<GroupProject> findTop5ByStatusOrderByGroupProjectIdDesc(ProjectStatus status);

	List<GroupProject> findByStatusAndTeamLead_Year(ProjectStatus status, Integer year);

	List<GroupProject> findByStatusAndTeamLead_Branch(ProjectStatus status, String branch);

	List<GroupProject> findByStatusAndTeamLead_BranchAndTeamLead_Year(ProjectStatus status, String branch, Integer year);

}
