package com.klu.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.GroupProject;
import com.klu.model.ProjectStatus;
import com.klu.model.Student;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.ActivityService;
import com.klu.service.CurrentUserService;
import com.klu.service.GroupProjectService;

@Service
public class GroupProjectImple implements GroupProjectService{

	@Autowired
	GroupProjectRepo groupProjectRepo;
	
	@Autowired 
	StudentRepo studentRepo; 
	
	@Autowired
	CurrentUserService currentUser;
	
	@Autowired
	ActivityService activityService;
	
	@Override
	public String SubmitGroupProject(GroupProject p,Long teamLeadId) {
		if (p.getStudentList() != null) {
			List<Student> managedStudents = p.getStudentList().stream().map((Student s) -> studentRepo.findById(s.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found: " + s.getStudentId()))).collect(Collectors.toList());
			p.setStudentList(managedStudents);
		}
		Student s = studentRepo.findById(teamLeadId).orElseThrow(() -> new RuntimeException("Team Lead Id do not found")) ;
		p.setTeamLead(s);
		p.setStatus(ProjectStatus.PENDING_REVIEW);
		groupProjectRepo.save(p);
		activityService.createActivity(s, "GROUP_PROJECT_CREATED",p.getProject_name());
		return "Group Project Submitted Sucessfully";
	}

	@Override
	public List<GroupProject> getLatestGroupSubmissions() {
		return groupProjectRepo.findTop5ByStatusOrderByGroupProjectIdDesc(ProjectStatus.APPROVED);
	}

	@Override
	public List<GroupProject> getAllProjects() {
		return groupProjectRepo.findByStatus(ProjectStatus.APPROVED);
	}

	@Override
	public List<GroupProject> getProjectsByYear(Integer year) {
		return groupProjectRepo.findByStatusAndTeamLead_Year(ProjectStatus.APPROVED, year);
	}

	@Override
	public List<GroupProject> getProjectsByBranch(String branch) {
		return groupProjectRepo.findByStatusAndTeamLead_Branch(ProjectStatus.APPROVED, branch);
	}

	@Override
	public List<GroupProject> getProjectsByBranchAndYear(String branch, Integer year) {
		return groupProjectRepo.findByStatusAndTeamLead_BranchAndTeamLead_Year(ProjectStatus.APPROVED, branch, year);
	}
	
	@Override
	public List<GroupProject> getProjectsByid(Long id) {
		return groupProjectRepo.findByTeamLead_StudentId(id);
	}

	public List<GroupProject> getPendingGroupProjects() {
		return groupProjectRepo.findByStatus(ProjectStatus.PENDING_REVIEW);
	}

	public String deleteProjectsById(int projectId) {
		GroupProject p = groupProjectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
		long currentUserId = currentUser.getCurrentStudent().getStudentId();
		if (!p.getTeamLead().getStudentId().equals(currentUserId)) {
		    throw new RuntimeException("Not authorized");
		}
		groupProjectRepo.delete(p);
		return "Project Deleted Sucessfully";
	}

}
