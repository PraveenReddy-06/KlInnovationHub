package com.klu.mail;

import java.time.Instant;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSignUp {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String name;
	
	@Column(unique = true)
	private String mail;
	
	private String role;
	
	private String password;
	private int otp;
	
	private LocalDateTime otpTimeOut;
	
	boolean verified;
	
	private boolean resetOtpVerified;

	private String interestedDomain;

    @JsonIgnore
    @ToString.Exclude
    @Column(length = 64)
    private String passwordResetCodeHash;

    @JsonIgnore
    private Instant passwordResetCodeExpiresAt;

    @JsonIgnore
    @ToString.Exclude
    @Column(length = 64)
    private String passwordResetTokenHash;

    @JsonIgnore
    private Instant passwordResetTokenExpiresAt;

    @JsonIgnore
    @Column(length = 36)
    private String credentialVersion;

    @JsonIgnore
    private Long lastAdminTotpStep;

}

