package com.klu.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.klu.exception.ForbiddenException;
import com.klu.exception.UnauthorizedException;
import com.klu.model.Reviewer;
import com.klu.repository.ReviewerRepo;

@Service
public class CurrentReviewerService {

    @Autowired
    private ReviewerRepo reviewerRepo;

    public Reviewer getCurrentReviewer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getName())) {
            throw new UnauthorizedException("Authentication required");
        }

        if (auth.getAuthorities().stream()
                .noneMatch(a -> "ROLE_REVIEWER".equals(a.getAuthority()))) {
            throw new ForbiddenException("This account does not have reviewer access");
        }

        return reviewerRepo.findByUserMail(auth.getName())
                .orElseThrow(() -> new ForbiddenException("Reviewer account not found"));
    }
}
