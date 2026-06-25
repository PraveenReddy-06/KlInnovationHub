package com.klu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FollowUserDto {

    private Long studentId;
    private String student_name;
    private String avatarUrl;
    private String branch;
}