package com.klu.dto;

import lombok.Data;

@Data
public class VerifyOtpDto {

	private String mail;
	private int otp;
}
