package com.klu.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.klu.mail.UserSignUpRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserSignUpRepository accounts;

    public CustomUserDetailsService(UserSignUpRepository accounts) {
        this.accounts = accounts;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return accounts.findByMail(username).map(AccountPrincipal::new)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found"));
    }
}
