package com.klu.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.klu.dto.AdminLoginResponseDto;
import com.klu.mail.Login;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.security.JwtService;

@Service
public class AdminLoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserSignUpRepository userRepo;

    @Autowired
    private JwtService jwtService;
    

    public AdminLoginResponseDto login(Login request) {
        String mail = request.getMail();

        if (mail == null || mail.isBlank()) {
            return failure("Email is required");
        }

        UserSignUp user = userRepo.findByMail(mail).orElse(null);
        if (user == null) {
            return failure("Admin account not found");
        }

        if (!"ROLE_ADMIN".equals(user.getRole())) {
            return failure("This account is not an admin account");
        }

        if (!user.isVerified()) {
            return failure("Admin account is not verified");
        }

        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(mail, request.getPassword()));

            String token = jwtService.generateToken(authentication.getName());
            return new AdminLoginResponseDto(
                    "Welcome To Admin Dashboard",
                    user.getName(),
                    user.getMail(),
                    token);
        } catch (BadCredentialsException e) {
            return failure("Bad Credentials");
        }
    }

    private AdminLoginResponseDto failure(String message) {
        return new AdminLoginResponseDto(message, null, null, null);
    }
    
}
