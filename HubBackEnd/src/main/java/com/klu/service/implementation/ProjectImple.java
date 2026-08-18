package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Project;
import com.klu.model.ProjectStatus;
import com.klu.model.Student;
import com.klu.repository.ProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.ActivityService;
import com.klu.service.CurrentUserService;
import com.klu.service.ProjectService;

@Service
public class ProjectImple implements ProjectService{

	@Autowired
	ProjectRepo projectRepo;
	
	@Autowired
	StudentRepo studentRepo;
	
	@Autowired
	CurrentUserService currentUser;
	
	@Autowired
	ActivityService activityService;
	
	@Override
	public String SubmitProject(Project p,Long id) {	
		Student student = studentRepo.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
		p.setStudent(student);
		p.setStatus(ProjectStatus.PENDING_REVIEW);
		projectRepo.save(p);
		activityService.createActivity(student,"PROJECT_CREATED",p.getProjectName());
		return "Project Submitted Sucessfully";
	}

	@Override
	public List<Project> getLatestSubmissions() {	
		return projectRepo.findTop5ByStatusOrderByProjectIdDesc(ProjectStatus.APPROVED);
	}

	@Override
	public List<Project> getAllProjects() {
		return projectRepo.findByStatus(ProjectStatus.APPROVED);
	}

	@Override
	public List<Project> getProjectsByYear(int year) {
		return projectRepo.findByStatusAndStudentYear(ProjectStatus.APPROVED, year);
	}

	@Override
	public List<Project> getProjectsByBranch(String bname) {
		return projectRepo.findByStatusAndStudentBranch(ProjectStatus.APPROVED, bname);
	}

	@Override
	public List<Project> getProjectsByid(long id) {
		return projectRepo.findByStudentStudentId(id);
	}

	public List<Project> getProjectsByBranchAndYear(String branch, Integer year) {
		return projectRepo.findByStatusAndStudentBranchAndStudentYear(ProjectStatus.APPROVED, branch, year);
	}

	public List<Project> getPendingProjects() {
		return projectRepo.findByStatus(ProjectStatus.PENDING_REVIEW);
	}

	public String deleteProjectsById(int projectId) {
		Project p = projectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
		long currentUserId = currentUser.getCurrentStudent().getStudentId();
		if (!p.getStudent().getStudentId().equals(currentUserId)) {
		    throw new RuntimeException("Not authorized");
		}
		projectRepo.delete(p);
		return "Project Deleted Sucessfully";
	}

}
