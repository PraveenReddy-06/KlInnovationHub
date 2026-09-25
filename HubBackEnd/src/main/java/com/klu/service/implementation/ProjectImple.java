package com.klu.service.implementation;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.exception.ForbiddenException;
import com.klu.exception.ResourceNotFoundException;
import com.klu.exception.SubmissionCooldownException;
import com.klu.model.Project;
import com.klu.model.ProjectStatus;
import com.klu.model.Student;
import com.klu.repository.ProjectRepo;
import com.klu.repository.ReviewerRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.ActivityService;
import com.klu.service.CurrentUserService;
import com.klu.service.NotificationService;

@Service
public class ProjectImple implements com.klu.service.ProjectService {

	private static final long SUBMISSION_COOLDOWN_HOURS = 3;

	@Autowired ProjectRepo projectRepo;
	@Autowired StudentRepo studentRepo;
	@Autowired CurrentUserService currentUser;
	@Autowired ActivityService activityService;
	@Autowired NotificationService notificationService;
	@Autowired ReviewerRepo reviewerRepo;
	@Autowired ReviewerEmailService reviewerEmailService;

	@Override
	@Transactional
	public String SubmitProject(Project p, Long id) {
		Student student = studentRepo.findLockedByStudentId(id)
				.orElseThrow(() -> new ResourceNotFoundException("Student not found"));

			LocalDateTime now = LocalDateTime.now();
			if (student.getLastProjectSubmissionAt() != null) {
				long elapsedMinutes = Duration.between(student.getLastProjectSubmissionAt(), now).toMinutes();
				if (elapsedMinutes < SUBMISSION_COOLDOWN_HOURS * 60) {
					long remainingMinutes = SUBMISSION_COOLDOWN_HOURS * 60 - elapsedMinutes;
					long remainingHours = remainingMinutes / 60;
					long remainingMins = remainingMinutes % 60;
					throw new SubmissionCooldownException(
							"Please wait " + remainingHours + " hour(s) and " + remainingMins
							+ " minute(s) before submitting another project."
					);
				}
			}
			student.setLastProjectSubmissionAt(now);
			studentRepo.save(student);

		p.setStudent(student);
		p.setStatus(ProjectStatus.PENDING_REVIEW);
		projectRepo.save(p);
		activityService.createActivity(student, "PROJECT_CREATED", p.getProjectName());
		notificationService.createNotification(student, student, "Your project has been submitted for review.", p.getProjectName());
		reviewerEmailService.notifyMatchingReviewers(p.getProjectName(), p.getChoice());
		return "Project Submitted Sucessfully";
	}

	@Override public List<Project> getLatestSubmissions() { return projectRepo.findTop5ByStatusOrderByProjectIdDesc(ProjectStatus.APPROVED); }
	@Override public List<Project> getAllProjects() { return projectRepo.findByStatus(ProjectStatus.APPROVED); }
	@Override public List<Project> getProjectsByYear(int year) { return projectRepo.findByStatusAndStudentYear(ProjectStatus.APPROVED, year); }
	@Override public List<Project> getProjectsByBranch(String bname) { return projectRepo.findByStatusAndStudentBranch(ProjectStatus.APPROVED, bname); }
	@Override public List<Project> getProjectsByid(long id) { return projectRepo.findByStudentStudentId(id).stream().filter(project -> project.getStatus() == ProjectStatus.APPROVED).collect(Collectors.toList()); }
	@Override public List<Project> getProjectsByBranchAndYear(String branch, Integer year) { return projectRepo.findByStatusAndStudentBranchAndStudentYear(ProjectStatus.APPROVED, branch, year); }

	public List<Project> getPendingProjects() { return projectRepo.findByStatus(ProjectStatus.PENDING_REVIEW); }

	public List<Project> getRecommendedProjects(String choice1, String choice2, String choice3) {
		return Arrays.asList(choice1, choice2, choice3).stream().filter(c -> c != null && !c.isBlank()).distinct()
			.flatMap(choice -> projectRepo.findByStatusAndChoice(ProjectStatus.PENDING_REVIEW, choice).stream())
			.collect(Collectors.toMap(Project::getProjectId, p -> p, (first, second) -> first)).values().stream().toList();
	}

	@Override
	public String deleteProjectsById(int projectId) {
		Project p = projectRepo.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
		long currentUserId = currentUser.getCurrentStudent().getStudentId();
		if (!p.getStudent().getStudentId().equals(currentUserId)) throw new ForbiddenException("Not authorized");
		projectRepo.delete(p);
		return "Project Deleted Sucessfully";
	}
	
	@Override
	public List<Project> getMyPendingProjects() {
	    Long studentId = currentUser.getCurrentStudent().getStudentId();

	    return projectRepo.findByStudentStudentId(studentId)
	            .stream()
	            .filter(project -> project.getStatus() == ProjectStatus.PENDING_REVIEW)
	            .collect(Collectors.toList());
	}
}
