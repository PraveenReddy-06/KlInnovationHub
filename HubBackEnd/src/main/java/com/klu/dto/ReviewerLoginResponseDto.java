package com.klu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewerLoginResponseDto {

    private String message;
    private Integer reviewerId;
    private String name;
    private String email;
    private String department;
    private String designation;

    private String choice1;
    private String choice2;
    private String choice3;

    private String token;
}