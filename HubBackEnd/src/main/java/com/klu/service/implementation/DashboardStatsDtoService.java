package com.klu.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.DashboardStatsDTO;
import com.klu.repository.CollaborationRepo;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.ProjectRepo;
import com.klu.repository.ReviewerRepo;
import com.klu.repository.StudentRepo;

@Service
public class DashboardStatsDtoService {

	@Autowired
	private ProjectRepo projectRepo;
	
	@Autowired
	private GroupProjectRepo groupProjectRepo;

	@Autowired
	private StudentRepo studentRepo;

	@Autowired
	private CollaborationRepo collaborationRepo;

	@Autowired
	private ReviewerRepo reviewerRepo;

	
	public DashboardStatsDTO getDashboardStats() {

	    long projects =projectRepo.count() +groupProjectRepo.count();
	    long students = studentRepo.count();
	    long collaborations = collaborationRepo.count();
	    long faculty = reviewerRepo.count();
	    return new DashboardStatsDTO(
	            projects,
	            students,
	            collaborations,
	            faculty
	    );
	}
}
