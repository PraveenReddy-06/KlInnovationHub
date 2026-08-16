package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.ReviewerRequest;
import com.klu.service.implementation.ReviewerAdminService;

@RestController
@RequestMapping("/admin/reviewers")
@PreAuthorize("hasRole('ADMIN')")
public class ReviewerAdminController {

    @Autowired
    private ReviewerAdminService reviewerAdminService;

    @GetMapping("/requests")
    public List<ReviewerRequest> getPendingRequests() {
        return reviewerAdminService.getPendingRequests();
    }

    @PostMapping("/requests/{requestId}/approve")
    public String approveRequest(@PathVariable Integer requestId) {
        return reviewerAdminService.approveRequest(requestId);
    }

    @PostMapping("/requests/{requestId}/reject")
    public String rejectRequest(@PathVariable Integer requestId) {
        return reviewerAdminService.rejectRequest(requestId);
    }
}
