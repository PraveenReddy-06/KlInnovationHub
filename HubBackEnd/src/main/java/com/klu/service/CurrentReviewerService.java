package com.klu.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.klu.model.Reviewer;
import com.klu.repository.ReviewerRepo;

@Service
public class CurrentReviewerService {

    @Autowired
    private ReviewerRepo reviewerRepo;

    public Reviewer getCurrentReviewer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Reviewer is not authenticated");
        }

        return reviewerRepo.findByUserMail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Reviewer account not found"));
    }
}
