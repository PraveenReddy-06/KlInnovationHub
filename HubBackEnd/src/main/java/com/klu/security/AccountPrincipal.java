package com.klu.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.klu.mail.UserSignUp;

final class AccountPrincipal extends User {

    private final String credentialVersion;

    AccountPrincipal(UserSignUp account) {
        super(account.getMail(), account.getPassword(), account.isVerified(), true, true, true,
                List.of(new SimpleGrantedAuthority(account.getRole())));
        this.credentialVersion = account.getCredentialVersion();
    }

    String credentialVersion() {
        return credentialVersion;
    }
}
