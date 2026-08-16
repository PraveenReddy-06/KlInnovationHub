package com.klu.service.implementation;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.klu.dto.ReviewerSignupDto;
import com.klu.dto.ReviewerVerifyOtpDto;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.model.Reviewer;
import com.klu.model.ReviewerRequest;
import com.klu.model.ReviewerRequestStatus;
import com.klu.model.ReviewerStatus;
import com.klu.repository.ReviewerRepo;
import com.klu.repository.ReviewerRequestRepo;

@Service
public class ReviewerRegistrationService {

    private static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$";

    @Autowired
    private JavaMailSender sender;

    @Autowired
    private UserSignUpRepository userRepo;

    @Autowired
    private ReviewerRepo reviewerRepo;

    @Autowired
    private ReviewerRequestRepo reviewerRequestRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateOtp(ReviewerSignupDto request) {
        if (request.getMail() == null || !request.getMail().matches("^[A-Za-z0-9._%+-]+@kluniversity\\.in$")) {
            return "Use a valid KL University email";
        }

        if (request.getPassword() == null || !request.getPassword().matches(PASSWORD_REGEX)) {
            return "Password does not meet security requirements";
        }

        Optional<UserSignUp> existing = userRepo.findByMail(request.getMail());
        if (existing.isPresent() && existing.get().isVerified()) {
            Reviewer reviewer = reviewerRepo.findByUserMail(request.getMail()).orElse(null);
            if (reviewer == null) {
                return "User already exists. Please login.";
            }

            if (reviewer.getStatus() == ReviewerStatus.ACTIVE) {
                return "Reviewer account already active. Please login.";
            }

            ReviewerRequest latestRequest = reviewerRequestRepo
                    .findTopByReviewerReviewerIdOrderByCreatedAtDesc(reviewer.getReviewerId())
                    .orElse(null);

            if (reviewer.getStatus() == ReviewerStatus.PENDING
                    || (latestRequest != null && latestRequest.getStatus() == ReviewerRequestStatus.PENDING)) {
                return "Your reviewer application is already pending approval.";
            }

            if (reviewer.getStatus() == ReviewerStatus.REJECTED && latestRequest != null
                    && latestRequest.getReviewedAt() != null) {
                long days = ChronoUnit.DAYS.between(latestRequest.getReviewedAt(), LocalDateTime.now());
                if (days < 15) {
                    return "You can request again after " + (15 - days) + " day(s).";
                }
            }
        }

        int otp = secureRandom.nextInt(9000) + 1000;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getMail());
        message.setSubject("Verify Your Reviewer Account • KL Innovation Hub");
        message.setText(
                "Hello " + request.getName() + ",\n\n" +
                "Use the OTP below to verify your email address for the KL Innovation Hub Project Reviewer application.\n\n" +
                "OTP : " + otp + "\n\n" +
                "This OTP is valid for 3 minutes.\n\n" +
                "After verification, your reviewer application will be sent to the administrator for approval.\n\n" +
                "— KL Innovation Hub");
        sender.send(message);

        UserSignUp user = existing.orElseGet(UserSignUp::new);
        user.setName(request.getName());
        user.setMail(request.getMail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_REVIEWER");
        user.setOtp(otp);
        user.setOtpTimeOut(LocalDateTime.now());
        user.setVerified(false);
        user.setResetOtpVerified(false);
        userRepo.save(user);

        return "OTP sent successfully";
    }

    public String verifyOtp(ReviewerVerifyOtpDto request) {
        UserSignUp user = userRepo.findByMail(request.getMail())
                .orElseThrow(() -> new RuntimeException("Mail Not Found"));

        if (!"ROLE_REVIEWER".equals(user.getRole())) {
            return "This account is not a reviewer account";
        }

        LocalDateTime otpTime = user.getOtpTimeOut();
        if (otpTime == null || otpTime.plusMinutes(3).isBefore(LocalDateTime.now())) {
            return "OTP Request TimeOut";
        }

        if (user.getOtp() != request.getOtp()) {
            return "Invalid OTP";
        }

        Reviewer reviewer = reviewerRepo.findByUserMail(user.getMail()).orElse(null);

        user.setVerified(true);
        user.setOtp(0);
        user.setOtpTimeOut(null);
        userRepo.save(user);

        if (reviewer == null) {
            reviewer = new Reviewer();
            reviewer.setUser(user);
        } else if (reviewer.getStatus() != ReviewerStatus.REJECTED) {
            return "Your reviewer application is already active or pending.";
        }

        reviewer.setDepartment(request.getDepartment());
        reviewer.setDesignation(request.getDesignation());
        reviewer.setStatus(ReviewerStatus.PENDING);
        reviewerRepo.save(reviewer);

        ReviewerRequest reviewerRequest = new ReviewerRequest();
        reviewerRequest.setReviewer(reviewer);
        reviewerRequest.setReason(request.getReason());
        reviewerRequest.setStatus(ReviewerRequestStatus.PENDING);
        reviewerRequest.setCreatedAt(LocalDateTime.now());
        reviewerRequestRepo.save(reviewerRequest);

        return "Email verified. Your reviewer application is pending admin approval.";
    }
}
