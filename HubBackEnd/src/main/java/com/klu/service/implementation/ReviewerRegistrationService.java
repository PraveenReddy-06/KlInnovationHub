package com.klu.service.implementation;

import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.security.ratelimit.AuthRateLimiter.Action;

import com.klu.dto.ReviewerSignupDto;
import com.klu.dto.ReviewerVerifyOtpDto;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.model.ReviewerRequest;
import com.klu.model.ReviewerRequestStatus;
import com.klu.repository.ReviewerRepo;
import com.klu.repository.ReviewerRequestRepo;

@Service
public class ReviewerRegistrationService {

    @Autowired private AuthRateLimiter limiter;

    private static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,64}$";
    private static final String[] VALID_CHOICES = {
            "AI/ML", "Data Science", "Web Development", "Mobile App Development",
            "Cloud Computing", "Cybersecurity", "Internet of Things (IoT)", "Robotics",
            "Embedded Systems", "Blockchain", "Computer Vision",
            "Natural Language Processing (NLP)", "DevOps", "AR/VR", "Other"
    };

    @Autowired private JavaMailSender sender;
    @Autowired private UserSignUpRepository userRepo;
    @Autowired private ReviewerRepo reviewerRepo;
    @Autowired private ReviewerRequestRepo reviewerRequestRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public String generateOtp(ReviewerSignupDto request) {
        if (request.getMail() == null || !request.getMail().matches("^[A-Za-z0-9]+(?:[._][A-Za-z0-9]+)*@kluniversity\\.in$")) {
            return "Use a valid KL University email";
        }
        if (request.getPassword() == null || !request.getPassword().matches(PASSWORD_REGEX)
                || request.getPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
            return "Password does not meet security requirements";
        }
        String choiceError = validateChoices(request.getChoice1(), request.getChoice2(), request.getChoice3());
        if (choiceError != null) return choiceError;

        Optional<UserSignUp> existing = userRepo.findByMailForUpdate(request.getMail());
        if (existing.isPresent() && existing.get().isVerified()) {
            UserSignUp user = existing.get();
            if (!"ROLE_REVIEWER".equals(user.getRole())) return "User already exists. Please login.";
            if (reviewerRepo.findByUserMail(request.getMail()).isPresent()) return "Reviewer account already active. Please login.";
            ReviewerRequest latestRequest = reviewerRequestRepo.findTopByUserIdOrderByCreatedAtDesc(user.getId()).orElse(null);
            if (latestRequest != null && latestRequest.getStatus() == ReviewerRequestStatus.PENDING) return "Your reviewer application is already pending approval.";
            if (latestRequest != null && latestRequest.getStatus() == ReviewerRequestStatus.REJECTED && latestRequest.getReviewedAt() != null) {
                long days = ChronoUnit.DAYS.between(latestRequest.getReviewedAt(), LocalDateTime.now());
                if (days < 15) return "You can request again after " + (15 - days) + " day(s).";
            }
        }

        if (existing.filter(user -> "ROLE_ADMIN".equals(user.getRole())).isPresent()) {
            return "User already exists. Please login.";
        }
        if (!limiter.acquire(Action.SIGNUP_ISSUE, request.getMail())) {
            return "Too many verification emails requested. Please try again later.";
        }
        int otp = secureRandom.nextInt(9000) + 1000;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getMail());
        message.setSubject("Verify Your Reviewer Account • KL Innovation Hub");
        message.setText("Hello " + request.getName() + ",\n\n" +
                "Use the OTP below to verify your email address for the KL Innovation Hub Project Reviewer application.\n\n" +
                "OTP : " + otp + "\n\nThis OTP is valid for 3 minutes.\n\n" +
                "After verification, your reviewer application will be sent to the administrator for approval.\n\n— KL Innovation Hub");
        try {
            sender.send(message);
        } catch (MailException deliveryFailure) {
            return "Unable to send OTP. Please try again later.";
        }

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

    @Transactional
    public String verifyOtp(ReviewerVerifyOtpDto request) {
        String choiceError = validateChoices(request.getChoice1(), request.getChoice2(), request.getChoice3());
        if (choiceError != null) return choiceError;
        UserSignUp user = userRepo.findByMailForUpdate(request.getMail()).orElse(null);
        if (user == null || user.isVerified() || !"ROLE_REVIEWER".equals(user.getRole())) {
            return "Invalid or expired OTP";
        }
        LocalDateTime otpTime = user.getOtpTimeOut();
        if (otpTime == null || !otpTime.plusMinutes(3).isAfter(LocalDateTime.now())) return "OTP Request TimeOut";
        if (!limiter.acquire(Action.SIGNUP_VERIFY,
                user.getId() + ":" + otpTime)) {
            return "Too many OTP attempts. Request a new OTP.";
        }
        if (user.getOtp() != request.getOtp()) return "Invalid OTP";

        user.setVerified(true);
        user.setOtp(0);
        user.setOtpTimeOut(null);
        userRepo.save(user);

        ReviewerRequest reviewerRequest = new ReviewerRequest();
        reviewerRequest.setUser(user);
        reviewerRequest.setDepartment(request.getDepartment());
        reviewerRequest.setDesignation(request.getDesignation());
        reviewerRequest.setReason(request.getReason());
        reviewerRequest.setChoice1(request.getChoice1());
        reviewerRequest.setChoice2(request.getChoice2());
        reviewerRequest.setChoice3(request.getChoice3());
        reviewerRequest.setStatus(ReviewerRequestStatus.PENDING);
        reviewerRequest.setCreatedAt(LocalDateTime.now());
        reviewerRequestRepo.save(reviewerRequest);
        return "Email verified. Your reviewer application is pending admin approval.";
    }

    private String validateChoices(String choice1, String choice2, String choice3) {
        if (!isValidChoice(choice1) || !isValidChoice(choice2) || !isValidChoice(choice3)) {
            return "Please select exactly three valid project categories";
        }
        if (choice1.equals(choice2) || choice1.equals(choice3) || choice2.equals(choice3)) {
            return "Project categories must be different";
        }
        return null;
    }

    private boolean isValidChoice(String choice) {
        if (choice == null || choice.isBlank()) return false;
        for (String validChoice : VALID_CHOICES) if (validChoice.equals(choice)) return true;
        return false;
    }
}
