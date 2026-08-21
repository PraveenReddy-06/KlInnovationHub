package com.klu.service;

import java.util.List;

import com.klu.dto.ReviewFeedbackDto;
import com.klu.dto.ReviewerReviewHistoryDto;

public interface ReviewerReviewService {

    String approveProject(Integer projectId, ReviewFeedbackDto request);

    String rejectProject(Integer projectId, ReviewFeedbackDto request);

    String approveGroupProject(Integer groupProjectId, ReviewFeedbackDto request);

    String rejectGroupProject(Integer groupProjectId, ReviewFeedbackDto request);
    List<ReviewerReviewHistoryDto> getReviewHistory();
}
