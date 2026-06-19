package com.klu.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserSignUpRepository repo;
	
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		 UserSignUp user = repo.findByMail(username).orElseThrow(() ->new UsernameNotFoundException("User not found with email: " + username));
	        return new User(user.getMail(), user.getPassword(),List.of(new SimpleGrantedAuthority(user.getRole())));
	}

	
}
