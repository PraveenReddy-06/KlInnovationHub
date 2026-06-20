package com.klu.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()) .authorizeHttpRequests(auth -> auth
                .requestMatchers("/mail/**").permitAll()
                .anyRequest().permitAll());
		return http.build();
	}
	
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config )throws Exception {
        return config.getAuthenticationManager();
    }
}
