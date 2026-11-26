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
import com.klu.security.ratelimit.AuthRateLimiter;
import com.klu.security.ratelimit.AuthRateLimiter.Action;

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
    private AuthRateLimiter limiter;

    public ReviewerLoginResponseDto login(Login request) {
        String mail = request.getMail();

        if (mail == null || mail.isBlank()) {
            return failure("Email is required");
        }

        UserSignUp user = userRepo.findByMail(mail.strip()).orElse(null);
        if (user == null) {
            return failure("Reviewer account not found");
        }

        if (!"ROLE_REVIEWER".equals(user.getRole())) {
            return failure("This account is not a reviewer account");
        }

        if (!user.isVerified()) {
            return failure("Please verify your email first");
        }

        Reviewer reviewer = reviewerRepo.findByUserMail(user.getMail()).orElse(null);
        if (reviewer == null) {
            return failure("Your reviewer application is still pending approval or was rejected");
        }

        if (request.getPassword() == null) {
            return failure("Password is required");
        }
        if (!limiter.acquire(Action.LOGIN, user.getMail())) {
            return failure(AuthRateLimiter.LOGIN_LIMIT_MESSAGE);
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getMail(), request.getPassword()));
            String token = jwtService.generateToken(authentication);
            limiter.clearLogin(user.getMail());

            return new ReviewerLoginResponseDto(
                    "Welcome To Reviewer Dashboard",
                    reviewer.getReviewerId(),
                    user.getName(),
                    user.getMail(),
                    reviewer.getDepartment(),
                    reviewer.getDesignation(),
                    reviewer.getChoice1(),
                    reviewer.getChoice2(),
                    reviewer.getChoice3(),
                    token);
        } catch (BadCredentialsException e) {
            return failure("Bad Credentials");
        }
    }

    private ReviewerLoginResponseDto failure(String message) {
        return new ReviewerLoginResponseDto(message, null, null, null, null, null, null, null, null, null);
    }
}
