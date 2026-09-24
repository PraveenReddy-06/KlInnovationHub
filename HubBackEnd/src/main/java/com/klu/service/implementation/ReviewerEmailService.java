package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.klu.model.Reviewer;
import com.klu.repository.ReviewerRepo;

@Service
public class ReviewerEmailService {

    @Autowired
    private ReviewerRepo reviewerRepo;

    @Autowired
    private JavaMailSender sender;

    public void notifyMatchingReviewers(String projectName, String choice) {
        if (choice == null || choice.isBlank()) return;

        List<Reviewer> reviewers = reviewerRepo.findByChoice1OrChoice2OrChoice3(choice, choice, choice);
        for (Reviewer reviewer : reviewers) {
            if (reviewer.getUser() == null || reviewer.getUser().getMail() == null) continue;
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(reviewer.getUser().getMail());
                message.setSubject("New Project to Review - KL Innovation Hub");
                message.setText("Hello " + reviewer.getUser().getName() + ",\n\n" +
                        "A new student project matching one of your selected review categories has been submitted.\n\n" +
                        "Project: " + projectName + "\n" +
                        "Category: " + choice + "\n\n" +
                        "Please sign in to the KL Innovation Hub reviewer dashboard to review it.\n\n— KL Innovation Hub");
                sender.send(message);
            } catch (RuntimeException ignored) {
                // Email delivery failure must not roll back a successful project submission.
            }
        }
    }
}
