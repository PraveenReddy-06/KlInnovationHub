package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.GroupProject;
import com.klu.repository.GroupProjectRepo;
import com.klu.service.GroupProjectService;

@Service
public class GroupProjectImple implements GroupProjectService{

	@Autowired
	GroupProjectRepo groupProjectRepo;
	
	
	@Override
	public String SubmitGroupProject(GroupProject p) {
		groupProjectRepo.save(p);
		return "Group Project Submitted Sucessfully";
	}

	@Override
	public List<GroupProject> getLatestGroupSubmissions() {
		return groupProjectRepo.findTop5ByOrderByGroupProjectIdDesc();
	}

	@Override
	public List<GroupProject> getAllProjects() {
		
		return groupProjectRepo.findAll();
	}

	@Override
	public List<GroupProject> getProjectsByYear(int year) {
		return groupProjectRepo.getProjectsByYear(year);
	}

	@Override
	public List<GroupProject> getProjectsByBranch(String branch) {
		return groupProjectRepo.getProjectsByBranch(branch);
	}

	@Override
	public List<GroupProject> getProjectsByBranchAndYear(String branch, int year) {
		return groupProjectRepo.getProjectsByBranchAndYear(branch,year);
	}
	
	@Override
	public List<GroupProject> getProjectsByid(long id) {
		return groupProjectRepo.getProjectsByid(id);
	}


}
