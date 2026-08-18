package com.klu.service.implementation;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.dto.ReviewFeedbackDto;
import com.klu.model.GroupProject;
import com.klu.model.Project;
import com.klu.model.ProjectReview;
import com.klu.model.ProjectStatus;
import com.klu.model.Reviewer;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.ProjectRepo;
import com.klu.repository.ProjectReviewRepo;
import com.klu.service.CurrentReviewerService;
import com.klu.service.ReviewerReviewService;

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
}
