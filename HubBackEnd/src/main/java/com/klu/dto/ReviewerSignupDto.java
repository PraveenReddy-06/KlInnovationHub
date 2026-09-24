package com.klu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewerSignupDto {
    private String name;
    private String mail;
    private String password;
    private String department;
    private String designation;
    private String reason;
    private String choice1;
    private String choice2;
    private String choice3;
}
