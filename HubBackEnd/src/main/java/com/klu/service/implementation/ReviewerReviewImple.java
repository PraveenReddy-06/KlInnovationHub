package com.klu.service.implementation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.dto.ReviewFeedbackDto;
import com.klu.dto.ReviewerReviewHistoryDto;
import com.klu.model.GroupProject;
import com.klu.model.Project;
import com.klu.model.ProjectReview;
import com.klu.model.ProjectStatus;
import com.klu.model.Reviewer;
import com.klu.model.Student;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.ProjectRepo;
import com.klu.repository.ProjectReviewRepo;
import com.klu.service.CurrentReviewerService;
import com.klu.service.NotificationService;
import com.klu.service.ReviewerReviewService;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class ReviewerReviewImple implements ReviewerReviewService {

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private GroupProjectRepo groupProjectRepo;

    @Autowired
    private ProjectReviewRepo projectReviewRepo;

    @Autowired
    private CurrentReviewerService currentReviewer;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JavaMailSender sender;

    private final ScheduledExecutorService cleanupScheduler =
            Executors.newSingleThreadScheduledExecutor(r -> {
                Thread thread = new Thread(r, "rejected-project-cleanup");
                thread.setDaemon(true);
                return thread;
            });

    @PostConstruct
    public void startRejectedProjectCleanup() {
        cleanupScheduler.scheduleAtFixedRate(this::deleteExpiredRejectedProjects,1,1,TimeUnit.DAYS);
    }

    @PreDestroy
    public void stopRejectedProjectCleanup() {
        cleanupScheduler.shutdownNow();
    }

    @Override
    @Transactional
    public String approveProject(Integer projectId, ReviewFeedbackDto request) {
        return reviewProject(projectId, ProjectStatus.APPROVED, request == null ? null : request.getFeedback());
    }

    @Override
    @Transactional
    public String rejectProject(Integer projectId, ReviewFeedbackDto request) {
        String feedback = request == null ? null : request.getFeedback();
        if (feedback == null || feedback.trim().isEmpty()) {
            throw new IllegalArgumentException("Feedback is required when rejecting a project");
        }
        return reviewProject(projectId, ProjectStatus.REJECTED, feedback.trim());
    }

    @Override
    @Transactional
    public String approveGroupProject(Integer groupProjectId, ReviewFeedbackDto request) {
        return reviewGroupProject(groupProjectId, ProjectStatus.APPROVED,
                request == null ? null : request.getFeedback());
    }

    @Override
    @Transactional
    public String rejectGroupProject(Integer groupProjectId, ReviewFeedbackDto request) {
        String feedback = request == null ? null : request.getFeedback();
        if (feedback == null || feedback.trim().isEmpty()) {
            throw new IllegalArgumentException("Feedback is required when rejecting a group project");
        }
        return reviewGroupProject(groupProjectId, ProjectStatus.REJECTED, feedback.trim());
    }

    private String reviewProject(Integer projectId, ProjectStatus newStatus, String feedback) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        ensurePending(project.getStatus(), "Project");

        int updated = projectRepo.updateStatusIfPending(
                projectId, newStatus, ProjectStatus.PENDING_REVIEW);
        if (updated == 0) {
            throw new IllegalStateException("Project has already been reviewed");
        }

        saveReview(currentReviewer.getCurrentReviewer(), project, null,
                ProjectStatus.PENDING_REVIEW, newStatus, feedback);
        sendDecisionNotification(project.getStudent(), project.getProjectName(), newStatus, feedback);
        return "Project " + newStatus.name().toLowerCase() + " successfully";
    }

    private String reviewGroupProject(Integer groupProjectId, ProjectStatus newStatus, String feedback) {
        GroupProject project = groupProjectRepo.findById(groupProjectId)
                .orElseThrow(() -> new RuntimeException("Group project not found"));
        ensurePending(project.getStatus(), "Group project");

        int updated = groupProjectRepo.updateStatusIfPending(
                groupProjectId, newStatus, ProjectStatus.PENDING_REVIEW);
        if (updated == 0) {
            throw new IllegalStateException("Group project has already been reviewed");
        }

        saveReview(currentReviewer.getCurrentReviewer(), null, project,
                ProjectStatus.PENDING_REVIEW, newStatus, feedback);
        sendDecisionNotification(project.getTeamLead(), project.getProject_name(), newStatus, feedback);
        return "Group project " + newStatus.name().toLowerCase() + " successfully";
    }

    private void ensurePending(ProjectStatus status, String type) {
        if (status != ProjectStatus.PENDING_REVIEW) {
            throw new IllegalStateException(type + " has already been reviewed");
        }
    }

    private void saveReview(Reviewer reviewer, Project project, GroupProject groupProject,
            ProjectStatus previousStatus, ProjectStatus newStatus, String feedback) {
        ProjectReview review = new ProjectReview();
        review.setReviewer(reviewer);
        review.setProject(project);
        review.setGroupProject(groupProject);
        review.setPreviousStatus(previousStatus);
        review.setNewStatus(newStatus);
        review.setFeedback(feedback);
        review.setReviewedAt(LocalDateTime.now());
        projectReviewRepo.save(review);
    }

    private void sendDecisionNotification(Student student, String projectName,
            ProjectStatus status, String feedback) {
        String message = status == ProjectStatus.APPROVED
                ? "Your project has been approved."
                : "Your project has been rejected.";

        notificationService.createNotification(student, student, message, projectName);

        if (status == ProjectStatus.REJECTED) {
            sendRejectionEmail(student, projectName, feedback);
        }
    }

    private void sendRejectionEmail(Student student, String projectName, String feedback) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(student.getStudentEmail());
        message.setSubject("Project Review Update • KL Innovation Hub");
        message.setText(
                "Hello " + student.getStudent_name() + ",\n\n" +
                "Your project \"" + projectName + "\" has been rejected by the KL Innovation Hub project review committee.\n\n" +
                "Reviewer feedback:\n" + feedback + "\n\n" +
                "You can improve the project and submit it again according to the project review rules.\n\n" +
                "— KL Innovation Hub"
        );
        sender.send(message);
    }

    private void deleteExpiredRejectedProjects() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);

        projectReviewRepo.findAll().stream()
                .filter(review -> review.getNewStatus() == ProjectStatus.REJECTED)
                .filter(review -> review.getReviewedAt() != null && review.getReviewedAt().isBefore(cutoff))
                .forEach(this::deleteExpiredProject);
    }

    private void deleteExpiredProject(ProjectReview review) {
        if (review.getProject() != null) {
            Project project = review.getProject();
            projectReviewRepo.delete(review);
            projectReviewRepo.flush();
            projectRepo.delete(project);
            return;
        }

        if (review.getGroupProject() != null) {
            GroupProject groupProject = review.getGroupProject();
            projectReviewRepo.delete(review);
            projectReviewRepo.flush();
            groupProjectRepo.delete(groupProject);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewerReviewHistoryDto> getReviewHistory() {
        Reviewer reviewer = currentReviewer.getCurrentReviewer();
        return projectReviewRepo.findByReviewerOrderByReviewedAtDesc(reviewer).stream().map(ReviewerReviewHistoryDto::fromEntity).toList();
    }
}
