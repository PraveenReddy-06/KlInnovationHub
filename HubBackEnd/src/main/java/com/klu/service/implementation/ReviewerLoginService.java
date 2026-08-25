package com.klu.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.klu.dto.ReviewerLoginResponseDto;
import com.klu.mail.Login;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.model.Reviewer;
import com.klu.repository.ReviewerRepo;
import com.klu.security.JwtService;
import com.klu.security.ratelimit.LoginRateLimiterService;

@Service
public class ReviewerLoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserSignUpRepository userRepo;

    @Autowired
    private ReviewerRepo reviewerRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private LoginRateLimiterService loginRateLimiterService;

    public ReviewerLoginResponseDto login(Login request) {
        String mail = request.getMail();

        if (mail == null || mail.isBlank()) {
            return failure("Email is required");
        }

        if (loginRateLimiterService.isBlocked(mail)) {
            long minutes = loginRateLimiterService.getRemainingLockMinutes(mail);
            return failure("Too many failed login attempts. Try again in " + minutes + " minute(s).");
        }

        UserSignUp user = userRepo.findByMail(mail).orElse(null);
        if (user == null) {
            return failure("Reviewer account not found");
        }

        if (!"ROLE_REVIEWER".equals(user.getRole())) {
            return failure("This account is not a reviewer account");
        }

        if (!user.isVerified()) {
            return failure("Please verify your email first");
        }

        Reviewer reviewer = reviewerRepo.findByUserMail(mail).orElse(null);
        if (reviewer == null) {
            return failure("Your reviewer application is still pending approval or was rejected");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(mail, request.getPassword()));
            String token = jwtService.generateToken(authentication.getName());
            loginRateLimiterService.loginSucceeded(mail);

            return new ReviewerLoginResponseDto(
                    "Welcome To Reviewer Dashboard",
                    reviewer.getReviewerId(),
                    user.getName(),
                    user.getMail(),
                    reviewer.getDepartment(),
                    reviewer.getDesignation(),
                    token);
        } catch (BadCredentialsException e) {
            loginRateLimiterService.loginFailed(mail);
            return failure("Bad Credentials");
        }
    }

    private ReviewerLoginResponseDto failure(String message) {
        return new ReviewerLoginResponseDto(message, null, null, null, null, null, null);
    }
}
