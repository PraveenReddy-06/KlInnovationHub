package com.klu.service.implementation;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.model.GroupProject;
import com.klu.model.ProjectStatus;
import com.klu.model.Student;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.ActivityService;
import com.klu.service.CurrentUserService;
import com.klu.service.GroupProjectService;
import com.klu.service.NotificationService;

@Service
public class GroupProjectImple implements GroupProjectService{

	private static final long SUBMISSION_COOLDOWN_HOURS = 3;

	@Autowired GroupProjectRepo groupProjectRepo;
	@Autowired StudentRepo studentRepo;
	@Autowired CurrentUserService currentUser;
	@Autowired ActivityService activityService;
	@Autowired NotificationService notificationService;
	@Autowired ReviewerEmailService reviewerEmailService;
	
	@Override
	@Transactional
	public String SubmitGroupProject(GroupProject p,Long teamLeadId) {
		Student s = studentRepo.findLockedByStudentId(teamLeadId)
				.orElseThrow(() -> new RuntimeException("Team Lead Id do not found"));

			LocalDateTime now = LocalDateTime.now();
			if (s.getLastProjectSubmissionAt() != null) {
				long elapsedMinutes = Duration.between(s.getLastProjectSubmissionAt(), now).toMinutes();
				if (elapsedMinutes < SUBMISSION_COOLDOWN_HOURS * 60) {
					long remainingMinutes = SUBMISSION_COOLDOWN_HOURS * 60 - elapsedMinutes;
					long remainingHours = remainingMinutes / 60;
					long remainingMins = remainingMinutes % 60;
					throw new RuntimeException(
							"Please wait " + remainingHours + " hour(s) and " + remainingMins
							+ " minute(s) before submitting another project."
					);
				}
			}
			s.setLastProjectSubmissionAt(now);
			studentRepo.save(s);

		if (p.getStudentList() != null) {
			List<Student> managedStudents = p.getStudentList().stream().map((Student student) -> studentRepo.findById(student.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found: " + student.getStudentId()))).collect(Collectors.toList());
			p.setStudentList(managedStudents);
		}
		p.setTeamLead(s);
		p.setStatus(ProjectStatus.PENDING_REVIEW);
		groupProjectRepo.save(p);
		activityService.createActivity(s, "GROUP_PROJECT_CREATED",p.getProject_name());
		notificationService.createNotification(s, s, "Your project has been submitted for review.", p.getProject_name());
		reviewerEmailService.notifyMatchingReviewers(p.getProject_name(), p.getChoice());
		return "Group Project Submitted Sucessfully";
	}

	@Override public List<GroupProject> getLatestGroupSubmissions() { return groupProjectRepo.findTop5ByStatusOrderByGroupProjectIdDesc(ProjectStatus.APPROVED); }
	@Override public List<GroupProject> getAllProjects() { return groupProjectRepo.findByStatus(ProjectStatus.APPROVED); }
	@Override public List<GroupProject> getProjectsByYear(Integer year) { return groupProjectRepo.findByStatusAndTeamLead_Year(ProjectStatus.APPROVED, year); }
	@Override public List<GroupProject> getProjectsByBranch(String branch) { return groupProjectRepo.findByStatusAndTeamLead_Branch(ProjectStatus.APPROVED, branch); }
	@Override public List<GroupProject> getProjectsByBranchAndYear(String branch, Integer year) { return groupProjectRepo.findByStatusAndTeamLead_BranchAndTeamLead_Year(ProjectStatus.APPROVED, branch, year); }
	@Override public List<GroupProject> getProjectsByid(Long id) { return groupProjectRepo.findByTeamLead_StudentId(id).stream().filter(project -> project.getStatus() == ProjectStatus.APPROVED).collect(Collectors.toList()); }

	public List<GroupProject> getPendingGroupProjects() { return groupProjectRepo.findByStatus(ProjectStatus.PENDING_REVIEW); }

	public List<GroupProject> getRecommendedGroupProjects(String choice1, String choice2, String choice3) {
		return Arrays.asList(choice1, choice2, choice3).stream().filter(c -> c != null && !c.isBlank()).distinct()
			.flatMap(choice -> groupProjectRepo.findByStatusAndChoice(ProjectStatus.PENDING_REVIEW, choice).stream())
			.collect(Collectors.toMap(GroupProject::getGroupProjectId, p -> p, (first, second) -> first)).values().stream().toList();
	}

	public String deleteProjectsById(int projectId) {
		GroupProject p = groupProjectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
		long currentUserId = currentUser.getCurrentStudent().getStudentId();
		if (!p.getTeamLead().getStudentId().equals(currentUserId)) throw new RuntimeException("Not authorized");
		groupProjectRepo.delete(p);
		return "Project Deleted Sucessfully";
	}
	
	@Override
	public List<GroupProject> getMyPendingProjects() {
	    Long studentId = currentUser.getCurrentStudent().getStudentId();
	    return groupProjectRepo.findByTeamLead_StudentId(studentId)
	            .stream()
	            .filter(project -> project.getStatus() == ProjectStatus.PENDING_REVIEW)
	            .collect(Collectors.toList());
	}
}
