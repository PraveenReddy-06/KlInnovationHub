package com.klu.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.dto.ResetOtpResponse;
import com.klu.dto.ResetPasswordDto;
import com.klu.dto.VerifyResetOtpDto;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.repository.ReviewerRepo;
import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.security.ratelimit.AuthRateLimiter.Action;

@Service
public class PasswordRecoveryService {

    private static final Duration CODE_LIFETIME = Duration.ofMinutes(3);
    private static final Duration RESET_TOKEN_LIFETIME = Duration.ofMinutes(5);
    private static final String INVALID_CODE = "Invalid or expired OTP";
    private static final String INVALID_RESET = "Password reset has expired. Request a new OTP.";

    public enum AccountType {
        STUDENT("ROLE_STUDENT", "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,64}$"),
        REVIEWER("ROLE_REVIEWER", "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{10,64}$");

        private final String role;
        private final Pattern passwordPolicy;

        AccountType(String role, String passwordPolicy) {
            this.role = role;
            this.passwordPolicy = Pattern.compile(passwordPolicy);
        }

        boolean accepts(String password) {
            return password != null && passwordPolicy.matcher(password).matches()
                    && password.getBytes(StandardCharsets.UTF_8).length <= 72;
        }
    }

    private final UserSignUpRepository users;
    private final ReviewerRepo reviewers;
    private final PasswordEncoder encoder;
    private final JavaMailSender mailSender;
    private final AuthRateLimiter limiter;
    private final SecureRandom random = new SecureRandom();

    public PasswordRecoveryService(UserSignUpRepository users, ReviewerRepo reviewers,
            PasswordEncoder encoder, JavaMailSender mailSender, AuthRateLimiter limiter) {
        this.users = users;
        this.reviewers = reviewers;
        this.encoder = encoder;
        this.mailSender = mailSender;
        this.limiter = limiter;
    }

    @Transactional
    public String requestCode(AccountType type, String email) {
        UserSignUp user = eligibleAccount(type, email);
        if (user == null) {
            return "OTP Sent";
        }
        if (!limiter.acquire(Action.RESET_ISSUE, user.getMail())) {
            return "Too many password reset requests. Please try again later.";
        }

        String code = Integer.toString(random.nextInt(9000) + 1000);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getMail());
        message.setSubject("Reset your KL Innovation Hub password");
        message.setText("Your password reset OTP is " + code
                + ". It expires in 3 minutes. If you did not request a reset, ignore this email.");
        try {
            mailSender.send(message);
        } catch (MailException deliveryFailure) {
            return "Unable to send OTP. Please try again later.";
        }
        user.setPasswordResetCodeHash(encoder.encode(code));
        user.setPasswordResetCodeExpiresAt(Instant.now().plus(CODE_LIFETIME));
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetTokenExpiresAt(null);
        user.setResetOtpVerified(false);
        return "OTP Sent";
    }

    @Transactional
    public ResetOtpResponse verifyCode(AccountType type, VerifyResetOtpDto request) {
        UserSignUp user = eligibleAccount(type, request.getMail());
        if (user == null || user.getPasswordResetCodeHash() == null
                || !isCurrent(user.getPasswordResetCodeExpiresAt())) {
            return new ResetOtpResponse(INVALID_CODE, null);
        }
        if (!limiter.acquire(Action.RESET_VERIFY, challengeKey(user, user.getPasswordResetCodeExpiresAt()))) {
            return new ResetOtpResponse("Too many OTP attempts. Request a new OTP.", null);
        }
        if (!encoder.matches(Integer.toString(request.getOtp()), user.getPasswordResetCodeHash())) {
            return new ResetOtpResponse(INVALID_CODE, null);
        }

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        user.setPasswordResetCodeHash(null);
        user.setPasswordResetCodeExpiresAt(null);
        user.setPasswordResetTokenHash(digest(token));
        user.setPasswordResetTokenExpiresAt(Instant.now().plus(RESET_TOKEN_LIFETIME));
        return new ResetOtpResponse("OTP Verified", token);
    }

    @Transactional
    public String resetPassword(AccountType type, ResetPasswordDto request) {
        if (!type.accepts(request.getNewPassword())) {
            return "Password does not meet security requirements";
        }
        UserSignUp user = eligibleAccount(type, request.getMail());
        String token = request.getResetToken();
        if (user == null || token == null || token.length() != 43
                || user.getPasswordResetTokenHash() == null || !isCurrent(user.getPasswordResetTokenExpiresAt())) {
            return INVALID_RESET;
        }
        if (!limiter.acquire(Action.RESET_COMPLETE, challengeKey(user, user.getPasswordResetTokenExpiresAt()))) {
            return "Too many password reset attempts. Request a new OTP.";
        }
        if (!MessageDigest.isEqual(
                digest(token).getBytes(StandardCharsets.US_ASCII),
                user.getPasswordResetTokenHash().getBytes(StandardCharsets.US_ASCII))) {
            return INVALID_RESET;
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setCredentialVersion(UUID.randomUUID().toString());
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetTokenExpiresAt(null);
        user.setResetOtpVerified(false);
        user.setOtp(0);
        user.setOtpTimeOut(null);
        return "Password Updated Successfully";
    }

    private UserSignUp eligibleAccount(AccountType type, String email) {
        if (email == null || email.isBlank() || email.length() > 254) {
            return null;
        }
        UserSignUp user = users.findByMailForUpdate(email.strip()).orElse(null);
        if (user == null || !user.isVerified() || !type.role.equals(user.getRole())) {
            return null;
        }
        if (type == AccountType.REVIEWER && reviewers.findByUserMail(user.getMail()).isEmpty()) {
            return null;
        }
        return user;
    }

    private static boolean isCurrent(Instant expiration) {
        return expiration != null && expiration.isAfter(Instant.now());
    }

    private static String challengeKey(UserSignUp user, Instant expiration) {
        return user.getId() + ":" + expiration.toEpochMilli();
    }

    private static String digest(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }
}
