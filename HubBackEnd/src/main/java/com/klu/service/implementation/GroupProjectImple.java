package com.klu.service.implementation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.GroupProject;
import com.klu.model.Student;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.GroupProjectService;

@Service
public class GroupProjectImple implements GroupProjectService{

	@Autowired
	GroupProjectRepo groupProjectRepo;
	
	@Autowired 
	StudentRepo studentRepo; 
	
	
	@Override
	public String SubmitGroupProject(GroupProject p,Long teamLeadId) {
		if (p.getStudentList() != null) {
			List<Student> managedStudents = p.getStudentList().stream().map((Student s) -> studentRepo.findById(s.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found: " + s.getStudentId()))).collect(Collectors.toList());
			p.setStudentList(managedStudents);
		}
		Student s = studentRepo.findById(teamLeadId).orElseThrow(() -> new RuntimeException("Team Lead Id do not found")) ;
		p.setTeamLead(s);
		p.setSubmittedAt(LocalDateTime.now());
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
	public List<GroupProject> getProjectsByYear(Integer year) {
		return groupProjectRepo.findByTeamLead_Year(year);
	}

	@Override
	public List<GroupProject> getProjectsByBranch(String branch) {
		return groupProjectRepo.findByTeamLead_Branch(branch);
	}

	@Override
	public List<GroupProject> getProjectsByBranchAndYear(String branch, Integer year) {
		return groupProjectRepo.findByTeamLead_BranchAndTeamLead_Year(branch,year);
	}
	
	@Override
	public List<GroupProject> getProjectsByid(Long id) {
		return groupProjectRepo.findByTeamLead_StudentId(id);
	}


}
