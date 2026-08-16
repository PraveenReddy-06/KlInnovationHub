package com.klu.service.implementation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.model.Reviewer;
import com.klu.model.ReviewerRequest;
import com.klu.model.ReviewerRequestStatus;
import com.klu.model.ReviewerStatus;
import com.klu.repository.ReviewerRepo;
import com.klu.repository.ReviewerRequestRepo;

@Service
public class ReviewerAdminService {

    @Autowired
    private ReviewerRequestRepo reviewerRequestRepo;

    @Autowired
    private ReviewerRepo reviewerRepo;

    @Autowired
    private JavaMailSender sender;

    public List<ReviewerRequest> getPendingRequests() {
        return reviewerRequestRepo.findByStatusOrderByCreatedAtDesc(ReviewerRequestStatus.PENDING);
    }

    @Transactional
    public String approveRequest(Integer requestId) {
        ReviewerRequest request = reviewerRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Reviewer request not found"));

        if (request.getStatus() != ReviewerRequestStatus.PENDING) {
            return "This request has already been processed";
        }

        Reviewer reviewer = request.getReviewer();
        reviewer.setStatus(ReviewerStatus.ACTIVE);
        reviewerRepo.save(reviewer);

        request.setStatus(ReviewerRequestStatus.APPROVED);
        request.setReviewedAt(LocalDateTime.now());
        reviewerRequestRepo.save(request);

        sendDecisionMail(reviewer, true);
        return "Reviewer approved successfully";
    }

    @Transactional
    public String rejectRequest(Integer requestId) {
        ReviewerRequest request = reviewerRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Reviewer request not found"));

        if (request.getStatus() != ReviewerRequestStatus.PENDING) {
            return "This request has already been processed";
        }

        Reviewer reviewer = request.getReviewer();
        reviewer.setStatus(ReviewerStatus.REJECTED);
        reviewerRepo.save(reviewer);

        request.setStatus(ReviewerRequestStatus.REJECTED);
        request.setReviewedAt(LocalDateTime.now());
        reviewerRequestRepo.save(request);

        sendDecisionMail(reviewer, false);
        return "Reviewer request rejected";
    }

    private void sendDecisionMail(Reviewer reviewer, boolean approved) {
        if (reviewer.getUser() == null || reviewer.getUser().getMail() == null) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(reviewer.getUser().getMail());

        if (approved) {
            message.setSubject("Reviewer Application Approved - KL Innovation Hub");
            message.setText(
                    "Hello " + reviewer.getUser().getName() + ",\n\n" +
                    "Your application to become a Project Reviewer for KL Innovation Hub has been approved.\n\n" +
                    "You can now use the reviewer login to access your reviewer dashboard.\n\n" +
                    "— KL Innovation Hub");
        } else {
            message.setSubject("Reviewer Application Update - KL Innovation Hub");
            message.setText(
                    "Hello " + reviewer.getUser().getName() + ",\n\n" +
                    "Your application to become a Project Reviewer for KL Innovation Hub was not approved at this time.\n\n" +
                    "You can submit a new application after 15 days from the rejection date.\n\n" +
                    "— KL Innovation Hub");
        }

        sender.send(message);
    }
}
