package com.klu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewerVerifyOtpDto {
    private String mail;
    private int otp;
    private String department;
    private String designation;
    private String reason;
}
