package com.klu.service.implementation;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.klu.dto.ResetPasswordDto;
import com.klu.dto.VerifyResetOtpDto;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.model.Reviewer;
import com.klu.repository.ReviewerRepo;

@Service
public class ReviewerPasswordService {

    private static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{10,64}$";

    @Autowired
    private UserSignUpRepository userRepo;

    @Autowired
    private ReviewerRepo reviewerRepo;

    @Autowired
    private JavaMailSender sender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    public String forgotPassword(String mail) {
        UserSignUp user = userRepo.findByMail(mail).orElse(null);
        if (user == null || !"ROLE_REVIEWER".equals(user.getRole())) {
            return "Reviewer account not found";
        }
        if (!user.isVerified()) {
            return "Please verify your email first";
        }

        Reviewer reviewer = reviewerRepo.findByUserMail(mail).orElse(null);
        if (reviewer == null) {
            return "Your reviewer account is not approved";
        }

        int otp = secureRandom.nextInt(9000) + 1000;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mail);
        message.setSubject("Reset Your Reviewer Password • KL Innovation Hub");
        message.setText(
                "Hello " + user.getName() + ",\n\n" +
                "We received a request to reset your KL Innovation Hub reviewer password.\n\n" +
                "OTP : " + otp + "\n\n" +
                "This OTP is valid for 3 minutes. If you did not request this, you can ignore this email.\n\n" +
                "— KL Innovation Hub");
        sender.send(message);

        user.setOtp(otp);
        user.setOtpTimeOut(LocalDateTime.now());
        user.setResetOtpVerified(false);
        userRepo.save(user);
        return "OTP Sent";
    }

    public String verifyResetOtp(VerifyResetOtpDto request) {
        UserSignUp user = userRepo.findByMail(request.getMail()).orElse(null);
        if (user == null || !"ROLE_REVIEWER".equals(user.getRole())) {
            return "Reviewer account not found";
        }

        Reviewer reviewer = reviewerRepo.findByUserMail(request.getMail()).orElse(null);
        if (reviewer == null) {
            return "Your reviewer account is not approved";
        }

        if (user.getOtpTimeOut() == null || user.getOtpTimeOut().plusMinutes(3).isBefore(LocalDateTime.now())) {
            return "OTP Expired";
        }
        if (user.getOtp() != request.getOtp()) {
            return "Invalid OTP";
        }

        user.setResetOtpVerified(true);
        userRepo.save(user);
        return "OTP Verified";
    }

    public String resetPassword(ResetPasswordDto request) {
        UserSignUp user = userRepo.findByMail(request.getMail()).orElse(null);
        if (user == null || !"ROLE_REVIEWER".equals(user.getRole())) {
            return "Reviewer account not found";
        }

        Reviewer reviewer = reviewerRepo.findByUserMail(request.getMail()).orElse(null);
        if (reviewer == null) {
            return "Your reviewer account is not approved";
        }
        if (!request.getNewPassword().matches(PASSWORD_REGEX)) {
            return "Password must contain uppercase, lowercase, number, symbol and be at least 10 characters long";
        }
        if (!user.isResetOtpVerified()) {
            return "Verify OTP First";
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(0);
        user.setResetOtpVerified(false);
        user.setOtpTimeOut(null);
        userRepo.save(user);
        return "Password Updated Successfully";
    }
}
