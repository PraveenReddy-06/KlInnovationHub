package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.klu.dto.ReviewerReviewHistoryDto;

import com.klu.dto.ReviewFeedbackDto;
import com.klu.service.ReviewerReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reviewer/review")
public class ReviewerReviewController {

    @Autowired
    private ReviewerReviewService reviewService;

    @PostMapping("/project/{projectId}/approve")
    public ResponseEntity<String> approveProject( @PathVariable Integer projectId,@Valid @RequestBody(required = false) ReviewFeedbackDto request) {
        return ResponseEntity.ok(reviewService.approveProject(projectId, request));
    }

    @PostMapping("/project/{projectId}/reject")
    public ResponseEntity<String> rejectProject( @PathVariable Integer projectId,@Valid @RequestBody ReviewFeedbackDto request) {
        return ResponseEntity.ok(reviewService.rejectProject(projectId, request));
    }

    @PostMapping("/groupProject/{groupProjectId}/approve")
    public ResponseEntity<String> approveGroupProject(@PathVariable Integer groupProjectId, @Valid @RequestBody(required = false) ReviewFeedbackDto request) {
        return ResponseEntity.ok(reviewService.approveGroupProject(groupProjectId, request));
    }

    @PostMapping("/groupProject/{groupProjectId}/reject")
    public ResponseEntity<String> rejectGroupProject(@PathVariable Integer groupProjectId,@Valid @RequestBody ReviewFeedbackDto request) {
        return ResponseEntity.ok(reviewService.rejectGroupProject(groupProjectId, request));
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<ReviewerReviewHistoryDto>> getReviewHistory() {
        return ResponseEntity.ok(reviewService.getReviewHistory());
    }
}
