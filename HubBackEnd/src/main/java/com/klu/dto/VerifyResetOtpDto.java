package com.klu.dto;

import lombok.Data;

@Data
public class VerifyResetOtpDto {

    private String mail;
    private int otp;
}