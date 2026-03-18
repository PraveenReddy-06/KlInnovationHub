package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Project;
import com.klu.model.Student;
import com.klu.repository.ProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.ProjectService;

@Service
public class ProjectImple implements ProjectService{

	@Autowired
	ProjectRepo projectRepo;
	
	@Autowired
	StudentRepo studentRepo;
	
	@Override
	public String SubmitProject(Project p,Long id) {	
		Student student = studentRepo.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
		p.setStudent(student);
		projectRepo.save(p);
		return "Project Submitted Sucessfully";
	}

	@Override
	public List<Project> getLatestSubmissions() {	
		return projectRepo.findTop5ByOrderByProjectIdDesc();
	}

	@Override
	public List<Project> getAllProjects() {	
		return projectRepo.findAll();
	}

	@Override
	public List<Project> getProjectsByYear(int year) {	
		return projectRepo.findByStudentYear(year);
	}

	@Override
	public List<Project> getProjectsByBranch(String bname) {
		return projectRepo.findByStudentBranch(bname);
	}

	@Override
	public List<Project> getProjectsByid(long id) {
		
		return projectRepo.findByStudentStudentId(id);
	}

}
