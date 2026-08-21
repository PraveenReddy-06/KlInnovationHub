package com.klu.dto;

import java.time.LocalDateTime;

import com.klu.model.ProjectReview;
import com.klu.model.ProjectStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewerReviewHistoryDto {

    private Long reviewId;
    private Integer projectId;
    private Integer groupProjectId;
    private String projectName;
    private String type;
    private ProjectStatus decision;
    private String feedback;
    private LocalDateTime reviewedAt;
    public static ReviewerReviewHistoryDto fromEntity(ProjectReview review) {
        boolean isGroupProject = review.getGroupProject() != null;
        return new ReviewerReviewHistoryDto(
                review.getReviewId(),
                review.getProject() != null ? review.getProject().getProjectId(): null,
                review.getGroupProject() != null ? review.getGroupProject().getGroupProjectId(): null,
                isGroupProject? review.getGroupProject().getProject_name(): review.getProject() != null? review.getProject().getProjectName(): "Unknown Project",
                isGroupProject? "GROUP": "SOLO",
                review.getNewStatus(),
                review.getFeedback(),
                review.getReviewedAt()
        );
    }
}