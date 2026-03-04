package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Project;
import com.klu.repository.ProjectLikesRepo;
import com.klu.service.ProjectLikesServic;

@Service
public class ProjectLikesImple implements ProjectLikesServic{

	@Autowired
	ProjectLikesRepo likesRepo;
	
	@Override
	public List<Project> getTopProjects() {		
		return likesRepo.findTop5ByOrderByLikesDesc();
	}	
}
