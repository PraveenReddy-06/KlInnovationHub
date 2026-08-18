package com.klu.service;

import com.klu.dto.ReviewFeedbackDto;

public interface ReviewerReviewService {

    String approveProject(Integer projectId, ReviewFeedbackDto request);

    String rejectProject(Integer projectId, ReviewFeedbackDto request);

    String approveGroupProject(Integer groupProjectId, ReviewFeedbackDto request);

    String rejectGroupProject(Integer groupProjectId, ReviewFeedbackDto request);
}
